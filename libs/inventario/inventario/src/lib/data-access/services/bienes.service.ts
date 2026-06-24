import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Bien, BienFiltros, BienKpis, BienFormDto, BienPaginacion } from '../../models/inventario.model';
import {
  PagedResponse,
  ProductoResponse,
  EliminarProductosMasivaRequest,
  EliminacionMasivaResponse,
  ImportarProductosRequest,
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
    if (filtros?.busqueda)              params = params.set('descripcion', filtros.busqueda);
    if (filtros?.categoria)             params = params.set('categoria', filtros.categoria);
    if (filtros?.estado === 'Activo')   params = params.set('activo', 'true');
    if (filtros?.estado === 'Inactivo') params = params.set('activo', 'false');
    params = params
      .set('page', String(filtros?.page ?? 0))
      .set('size', String(filtros?.size ?? 10));

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
          // Una sola llamada bulk en vez de N (evita el N+1 de HTTP). El backend llavea
          // la existencia por codigoSena (productoId canónico) y omite los que no tienen.
          const params = new HttpParams().set('codigosSena', productos.map(p => p.codigoSena).join(','));
          return this.http
            .get<ExistenciaResponse[]>(`${API}/inventory/existencias`, { params })
            .pipe(
              catchError(() => of([] as ExistenciaResponse[])),
              map(existencias => {
                const porCodigo = new Map(existencias.map(e => [e.productoId, e]));
                return {
                  bienes: productos.map(p => {
                    const ex = porCodigo.get(p.codigoSena);
                    return ex ? bienFromCatalogoYExistencia(p, ex) : bienFromCatalogo(p);
                  }),
                  paginacion,
                };
              })
            );
        }),
        catchError(err => throwError(() => err))
      );
  }

  /**
   * Catálogo plano de bienes activos para el typeahead (cascada VLOOKUP).
   * NO resuelve existencias (evita el N+1): el typeahead solo necesita código,
   * descripción y precio — el bien ya trae el cód almacén y el precio del contrato.
   */
  buscarCatalogo(): Observable<Bien[]> {
    const params = new HttpParams()
      .set('activo', 'true')
      .set('page', '0')
      .set('size', '1000');

    return this.http
      .get<PagedResponse<ProductoResponse>>(`${API}/catalog/productos`, { params })
      .pipe(
        map(res => res.content.map(bienFromCatalogo)),
        catchError(err => throwError(() => err)),
      );
  }

  // ── Detalle enriquecido ──────────────────────────────────────────────────────

  /** GET /catalog/productos/{id} + GET /inventory/existencias/{id}
   *  Compone el Bien con estado de stock real (Agotado / Bajo Stock / Activo). */
  getBienById(id: string | number): Observable<Bien | undefined> {
    return this.http
      .get<ProductoResponse>(`${API}/catalog/productos/${id}`)
      .pipe(
        catchError(() => of(undefined)),
        // La existencia se consulta por codigoSena (productoId canónico), obtenido del
        // catálogo — no por el id (UUID), que nunca matchea la existencia almacenada.
        switchMap(cat => {
          if (!cat) return of<Bien | undefined>(undefined);
          return this.http
            .get<ExistenciaResponse>(`${API}/inventory/existencias/${cat.codigoSena}`)
            .pipe(
              catchError(() => of(null)),
              map(ex => bienFromCatalogoYExistencia(cat, ex ?? null))
            );
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
}
