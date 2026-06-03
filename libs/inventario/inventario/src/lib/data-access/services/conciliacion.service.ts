import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ConciliacionRegistro,
  ConciliacionDetalle,
  DiferenciaItem,
  TomaFisicaItem,
} from '../../models/conciliacion.model';
import {
  ConciliacionListItemResponse,
  ConciliacionDetailResponse,
  DiferenciaResponse,
  IniciarConciliacionRequest,
  RegistrarConteoRequest,
  ResolverDiferenciaRequest,
  CatalogoItemResponse,
} from '../api/reconciliation.api';
import { ConteoItemData } from '../../models/conciliacion.model';
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
      .get<ConciliacionListItemResponse[]>(`${API}/reconciliation/conciliaciones`)
      .pipe(
        map(list => list.map(conciliacionListItemFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getConciliacionById(id: string): Observable<ConciliacionDetalle | undefined> {
    return this.http
      .get<ConciliacionDetailResponse>(`${API}/reconciliation/conciliaciones/${id}`)
      .pipe(
        map(conciliacionDetailFromApi),
        catchError(err => throwError(() => err))
      );
  }

  getDiferenciasByConciliacion(id: string): Observable<DiferenciaItem[]> {
    return this.http
      .get<DiferenciaResponse[]>(`${API}/reconciliation/conciliaciones/${id}/diferencias`)
      .pipe(
        map(list => list.map(diferenciaFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /reconciliation/conciliaciones — responsableId, responsableNombre, tipo y fecha son obligatorios */
  iniciarTomaFisica(data: IniciarConciliacionRequest): Observable<{ id: string }> {
    return this.http
      .post<{ id: string }>(`${API}/reconciliation/conciliaciones`, data)
      .pipe(catchError(err => throwError(() => err)));
  }

  cerrarConciliacion(id: string): Observable<void> {
    return this.http
      .patch<void>(`${API}/reconciliation/conciliaciones/${id}/cerrar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /reconciliation/conciliaciones/{id}/conteo
   *  Registra el conteo físico de todos los ítems de la sesión.
   *  Respuesta: 204 No Content */
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

  /** PATCH /reconciliation/conciliaciones/{id}/diferencias/{diferenciaId}/resolver
   *  Respuesta: 204 No Content */
  resolverDiferencia(id: string, diferenciaId: string, justificacion: string): Observable<void> {
    const body: ResolverDiferenciaRequest = { justificacion };
    return this.http
      .patch<void>(
        `${API}/reconciliation/conciliaciones/${id}/diferencias/${diferenciaId}/resolver`,
        body,
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  /** GET /reconciliation/conciliaciones/catalogo — catálogo activo con stock actual del sistema */
  getTomaFisicaItems(): Observable<TomaFisicaItem[]> {
    return this.http
      .get<CatalogoItemResponse[]>(`${API}/reconciliation/conciliaciones/catalogo`)
      .pipe(
        map(list => list.map(catalogoItemToTomaFisicaItem)),
        catchError(err => throwError(() => err))
      );
  }
}
