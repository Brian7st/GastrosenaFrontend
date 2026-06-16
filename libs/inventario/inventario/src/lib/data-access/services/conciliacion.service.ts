import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ConciliacionRegistro,
  ConciliacionDetalle,
  DiferenciaItem,
  TomaFisicaItem,
  ConteoItemData,
} from '../../models/conciliacion.model';
import {
  ConciliacionBackendResponse,
  CatalogoItemResponse,
  IniciarConciliacionRequest,
  RegistrarConteoRequest,
  ResolverDiferenciaRequest,
} from '../api/reconciliation.api';
import {
  conciliacionListItemFromApi,
  conciliacionDetailFromApi,
  diferenciaFromApi,
  catalogoItemToTomaFisicaItem,
} from '../mappers/reconciliation.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ConciliacionService {
  private http = inject(HttpClient);

  getConciliaciones(): Observable<ConciliacionRegistro[]> {
    return this.http
      .get<ConciliacionBackendResponse[]>(`${API}/reconciliation/conciliaciones`)
      .pipe(
        map(list => list.map(conciliacionListItemFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /**
   * Retorna el detalle Y las diferencias en una sola llamada.
   * El backend embebe las diferencias en GET /{id} — no existe un endpoint separado.
   */
  getConciliacionConDiferencias(id: string): Observable<{
    detalle:      ConciliacionDetalle;
    diferencias:  DiferenciaItem[];
  }> {
    return this.http
      .get<ConciliacionBackendResponse>(`${API}/reconciliation/conciliaciones/${id}`)
      .pipe(
        map(raw => ({
          detalle:     conciliacionDetailFromApi(raw),
          diferencias: raw.diferencias.map(diferenciaFromApi),
        })),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /reconciliation/conciliaciones */
  iniciarTomaFisica(data: IniciarConciliacionRequest): Observable<{ id: string }> {
    return this.http
      .post<{ id: string }>(`${API}/reconciliation/conciliaciones`, data)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /reconciliation/conciliaciones/{id}/cerrar */
  cerrarConciliacion(id: string): Observable<void> {
    return this.http
      .patch<void>(`${API}/reconciliation/conciliaciones/${id}/cerrar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /reconciliation/conciliaciones/{id}/conteo — 204 No Content */
  registrarConteo(id: string, items: ConteoItemData[]): Observable<void> {
    const body: RegistrarConteoRequest = {
      items: items.map(i => ({
        codigoSena:      i.codigoSena,
        descripcion:     i.descripcion,
        cantidadSistema: i.cantidadSistema,
        cantidadFisica:  i.cantidadFisica,
        valorUnitario:   i.valorUnitario,
      })),
    };
    return this.http
      .post<void>(`${API}/reconciliation/conciliaciones/${id}/conteo`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /reconciliation/conciliaciones/{id}/diferencias/{diferenciaId}/resolver — 204 */
  resolverDiferencia(id: string, diferenciaId: string, justificacion: string): Observable<void> {
    const body: ResolverDiferenciaRequest = { justificacion };
    return this.http
      .patch<void>(
        `${API}/reconciliation/conciliaciones/${id}/diferencias/${diferenciaId}/resolver`,
        body,
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  /**
   * GET /reconciliation/conciliaciones/catalogo — catálogo activo con stock del sistema.
   * Si se indica `categoria`, el backend devuelve solo los bienes de esa categoría
   * (toma física por categoría).
   */
  getTomaFisicaItems(categoria?: string): Observable<TomaFisicaItem[]> {
    let params = new HttpParams();
    if (categoria && categoria.trim().length > 0) {
      params = params.set('categoria', categoria.trim());
    }
    return this.http
      .get<CatalogoItemResponse[]>(`${API}/reconciliation/conciliaciones/catalogo`, { params })
      .pipe(
        map(list => list.map(catalogoItemToTomaFisicaItem)),
        catchError(err => throwError(() => err))
      );
  }
}
