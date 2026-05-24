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
import { ConciliacionListItemResponse, ConciliacionDetailResponse, DiferenciaResponse } from '../api/reconciliation.api';
import {
  conciliacionListItemFromApi,
  conciliacionDetailFromApi,
  diferenciaFromApi,
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

  iniciarTomaFisica(): Observable<{ sesionId: string }> {
    return this.http
      .post<{ sesionId: string }>(`${API}/reconciliation/conciliaciones`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  cerrarConciliacion(id: string): Observable<void> {
    return this.http
      .patch<void>(`${API}/reconciliation/conciliaciones/${id}/cerrar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  /** TODO: endpoint de ítems de toma física pendiente de confirmación con backend */
  getTomaFisicaItems(): Observable<TomaFisicaItem[]> {
    return throwError(() => new Error('getTomaFisicaItems: endpoint no disponible — pendiente con backend'));
  }
}
