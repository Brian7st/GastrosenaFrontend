import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Bien, BienFiltros, BienKpis, BienFormDto } from '../../models/inventario.model';
import { PagedResponse, ProductoResponse } from '../api/catalog.api';
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

  /** GET /catalog/productos — lista paginada.
   *  Estado derivado de `activo`; valor = 0 (sin endpoint de precio). */
  getBienes(filtros?: BienFiltros): Observable<Bien[]> {
    let params = new HttpParams();
    if (filtros?.busqueda)  params = params.set('q', filtros.busqueda);
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.estado)    params = params.set('estado', filtros.estado);

    return this.http
      .get<PagedResponse<ProductoResponse>>(`${API}/catalog/productos`, { params })
      .pipe(
        map(res => res.content.map(bienFromCatalogo)),
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

  /** TODO: endpoint dedicado pendiente en backend. */
  getKpis(): Observable<BienKpis> {
    return of({ valorTotal: 0, totalAlertas: 0, movimientosHoy: 0 });
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

  deleteBien(id: string | number): Observable<void> {
    return this.http
      .delete<void>(`${API}/catalog/productos/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }
}
