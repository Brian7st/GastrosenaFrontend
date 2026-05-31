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
  bienFormToUpdateRequest,
} from '../mappers/catalog.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class BienesService {
  private http = inject(HttpClient);

  // ── Listado ──────────────────────────────────────────────────────────────────

  /** GET /catalog/productos — lista paginada (page 0-based, size por defecto 20). */
  getBienes(filtros?: BienFiltros): Observable<{ bienes: Bien[]; paginacion: BienPaginacion }> {
    let params = new HttpParams();
    if (filtros?.busqueda)              params = params.set('nombre', filtros.busqueda);
    if (filtros?.categoria)             params = params.set('categoria', filtros.categoria);
    if (filtros?.estado === 'Activo')   params = params.set('activo', 'true');
    if (filtros?.estado === 'Inactivo') params = params.set('activo', 'false');
    params = params
      .set('page', String(filtros?.page ?? 0))
      .set('size', String(filtros?.size ?? 10))
      .set('sort', 'id')
      .set('direction', 'DESC');

    return this.http
      .get<PagedResponse<ProductoResponse>>(`${API}/catalog/productos`, { params })
      .pipe(
        map(res => ({
          productos: res.content,
          paginacion: {
            totalElements: res.totalElements,
            totalPages:    res.totalPages,
            page:          res.page,
            size:          res.size,
          } as BienPaginacion,
        })),
        switchMap(({ productos, paginacion }) => {
          if (!productos.length) return of({ bienes: [] as Bien[], paginacion });
          const existencias$ = productos.map(p =>
            this.http
              .get<ExistenciaResponse>(`${API}/inventory/existencias/${p.id}`)
              .pipe(catchError(() => of(null)))
          );
          return forkJoin(existencias$).pipe(
            map(existencias => ({
              bienes: productos.map((p, i) =>
                existencias[i] ? bienFromCatalogoYExistencia(p, existencias[i]) : bienFromCatalogo(p)
              ),
              paginacion,
            }))
          );
        }),
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
      .patch<ProductoResponse>(`${API}/catalog/productos/${id}`, bienFormToUpdateRequest(form))
      .pipe(
        map(bienFromCatalogo),
        catchError(err => throwError(() => err))
      );
  }

  /** DELETE /catalog/productos/{id}?confirmacion=ELIMINAR */
  deleteBien(id: string | number): Observable<void> {
    const params = new HttpParams().set('confirmacion', 'ELIMINAR');
    return this.http
      .delete<void>(`${API}/catalog/productos/${id}`, { params })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /catalog/productos/{id}/desactivar */
  desactivarBien(id: string | number): Observable<Bien> {
    return this.http
      .patch<ProductoResponse>(`${API}/catalog/productos/${id}/desactivar`, {})
      .pipe(
        map(bienFromCatalogo),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /catalog/productos/{id}/activar */
  activarBien(id: string | number): Observable<Bien> {
    return this.http
      .patch<ProductoResponse>(`${API}/catalog/productos/${id}/activar`, {})
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

  /** POST /catalog/productos/importar — retorna los productos creados */
  importarBienes(productos: BienFormDto[]): Observable<ProductoResponse[]> {
    const body: ImportarProductosRequest = { productos: productos.map(bienFormToRequest) };
    return this.http
      .post<ProductoResponse[]>(`${API}/catalog/productos/importar`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /catalog/productos/importar-excel — retorna { importados: N } */
  importarBienesExcel(archivo: File): Observable<{ importados: number }> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http
      .post<{ importados: number }>(`${API}/catalog/productos/importar-excel`, formData)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /catalog/productos/exportaciones (202 Accepted — async) */
  solicitarExportacion(formato: 'CSV'): Observable<ExportacionProductosResponse> {
    const body: SolicitarExportacionRequest = { formato };
    return this.http
      .post<ExportacionProductosResponse>(`${API}/catalog/productos/exportaciones`, body)
      .pipe(catchError(err => throwError(() => err)));
  }
}
