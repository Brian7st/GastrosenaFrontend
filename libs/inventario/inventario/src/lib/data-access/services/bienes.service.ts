import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Bien, BienFiltros, BienKpis, BienFormDto, BienPaginacion } from '../../models/inventario.model';
import {
  PagedResponse,
  ProductoResponse,
  EliminarProductosMasivaRequest,
  EliminacionMasivaResponse,
  ImportarProductosRequest,
  SolicitarExportacionRequest,
  ExportacionProductosResponse,
} from '../api/catalog.api';
import { ExistenciaResponse } from '../api/inventory.api';
import {
  bienFromCatalogo,
  bienFromCatalogoYExistencia,
  bienFormToRequest,
} from '../mappers/catalog.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class BienesService {
  private http = inject(HttpClient);

  // ── Listado ──────────────────────────────────────────────────────────────────

  /** GET /catalog/productos — lista paginada (page 0-based, size por defecto 10). */
  getBienes(filtros?: BienFiltros): Observable<{ bienes: Bien[]; paginacion: BienPaginacion }> {
    let params = new HttpParams();
    if (filtros?.busqueda)              params = params.set('nombre', filtros.busqueda);
    if (filtros?.categoria)             params = params.set('categoria', filtros.categoria);
    if (filtros?.estado === 'Activo')   params = params.set('activo', 'true');
    if (filtros?.estado === 'Inactivo') params = params.set('activo', 'false');
    params = params.set('page', String(filtros?.page ?? 0));
    params = params.set('size', String(filtros?.size ?? 10));
    params = params.set('sort', 'id,desc');

    return this.http
      .get<PagedResponse<ProductoResponse>>(`${API}/catalog/productos`, { params })
      .pipe(
        map(res => ({
          productos: res.content,
          paginacion: {
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            page: res.page,
            size: res.size,
          },
        })),
        catchError(err => throwError(() => err)),
        map(({ productos, paginacion }) => ({
          productos,
          paginacion,
          bienesBase: productos.map(bienFromCatalogo),
        })),
        map(({ productos, paginacion, bienesBase }) => ({
          productos,
          paginacion,
          bienesBase,
          existencias$: productos.map(producto =>
            this.http
              .get<ExistenciaResponse>(`${API}/inventory/existencias/${producto.id}`)
              .pipe(catchError(() => of(null)))
          ),
        })),
        // Si el backend no tiene existencias para un producto, mantenemos los datos base.
        // Si existen, componemos el estado real de stock sin tocar la UI.
        switchMap(({ productos, paginacion, bienesBase, existencias$ }) =>
          (existencias$.length ? forkJoin(existencias$) : of([])).pipe(
            map(existencias => ({
              bienes: productos.map((producto, index) =>
                existencias[index]
                  ? bienFromCatalogoYExistencia(producto, existencias[index])
                  : bienesBase[index]
              ),
              paginacion,
            }))
          )
        ),
        catchError(err => throwError(() => err))
      );
  }

  // ── Detalle enriquecido ──────────────────────────────────────────────────────

  /** GET /catalog/productos/{id} + GET /inventory/existencias/{id}
   *  Compone el Bien con estado de stock real (Agotado / Bajo Stock / Activo). */
  getBienById(id: string | number): Observable<Bien | undefined> {
    const catalogo$ = this.http
      .get<ProductoResponse>(`${API}/catalog/productos/${id}`)
      .pipe(catchError(() => of(undefined)));

    const existencia$ = this.http
      .get<ExistenciaResponse>(`${API}/inventory/existencias/${id}`)
      .pipe(catchError(() => of(null)));

    return forkJoin([catalogo$, existencia$]).pipe(
      map(([cat, ex]) => {
        if (!cat) return undefined;
        return bienFromCatalogoYExistencia(cat, ex ?? null);
      }),
      catchError(err => throwError(() => err))
    );
  }

  // ── KPIs ─────────────────────────────────────────────────────────────────────

  /** GET /inventory/kpis */
  getKpis(): Observable<BienKpis> {
    return this.http
      .get<BienKpis>(`${API}/inventory/kpis`)
      .pipe(catchError(err => throwError(() => err)));
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  createBien(form: BienFormDto): Observable<Bien> {
    return this.http
      .post<ProductoResponse>(`${API}/catalog/productos`, bienFormToRequest(form))
      .pipe(
        map(bienFromCatalogo),
        catchError(err => throwError(() => err))
      );
  }

  updateBien(id: string | number, form: BienFormDto): Observable<Bien> {
    return this.http
      .patch<ProductoResponse>(`${API}/catalog/productos/${id}`, bienFormToRequest(form))
      .pipe(
        map(bienFromCatalogo),
        catchError(err => throwError(() => err))
      );
  }

  /** DELETE /catalog/productos/{id}?confirmacion={id} */
  deleteBien(id: string | number): Observable<void> {
    const params = new HttpParams().set('confirmacion', String(id));
    return this.http
      .delete<void>(`${API}/catalog/productos/${id}`, { params })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /catalog/productos/{id}/desactivar — soft delete: marca activo=false */
  desactivarBien(id: string | number): Observable<Bien> {
    return this.http
      .patch<ProductoResponse>(`${API}/catalog/productos/${id}/desactivar`, {})
      .pipe(
        map(bienFromCatalogo),
        catchError(err => throwError(() => err))
      );
  }

  // ── Operaciones masivas ──────────────────────────────────────────────────────

  /** POST /catalog/productos/eliminacion-masiva */
  eliminarBienesMasivo(ids: string[], confirmacion: string): Observable<EliminacionMasivaResponse> {
    const body: EliminarProductosMasivaRequest = { ids, confirmacion };
    return this.http
      .post<EliminacionMasivaResponse>(`${API}/catalog/productos/eliminacion-masiva`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /catalog/productos/importar */
  importarBienes(productos: BienFormDto[]): Observable<{ success: boolean }> {
    const body: ImportarProductosRequest = { productos: productos.map(bienFormToRequest) };
    return this.http
      .post<{ success: boolean }>(`${API}/catalog/productos/importar`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /catalog/productos/importar-excel */
  importarBienesExcel(archivo: File): Observable<{ success: boolean }> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http
      .post<{ success: boolean }>(`${API}/catalog/productos/importar-excel`, formData)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /catalog/productos/exportaciones (202 Accepted — async) */
  solicitarExportacion(formato: 'CSV' | 'EXCEL'): Observable<ExportacionProductosResponse> {
    const body: SolicitarExportacionRequest = { formato };
    return this.http
      .post<ExportacionProductosResponse>(`${API}/catalog/productos/exportaciones`, body)
      .pipe(catchError(err => throwError(() => err)));
  }
}
