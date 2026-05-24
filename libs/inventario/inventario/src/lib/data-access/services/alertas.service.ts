import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Alerta } from '../../models/alerta.model';
import { AlertaResponse, ResolverAlertaRequest } from '../api/alerts.api';
import { alertaFromApi } from '../mappers/alerts.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AlertasService {
  private http = inject(HttpClient);

  getAlertas(): Observable<Alerta[]> {
    return this.http
      .get<AlertaResponse[]>(`${API}/alerts/alertas`)
      .pipe(
        map(list => list.map(alertaFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getAlertaById(id: string): Observable<Alerta | undefined> {
    return this.http
      .get<AlertaResponse>(`${API}/alerts/alertas/${id}`)
      .pipe(
        map(alertaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  resolverAlerta(id: string, body: Record<string, unknown>): Observable<boolean> {
    return this.http
      .patch<void>(`${API}/alerts/alertas/${id}/resolver`, body)
      .pipe(
        map(() => true),
        catchError(err => throwError(() => err))
      );
  }

  // ── FE-05: los métodos de umbrales e historial no tienen endpoint en backend aún ──

  /** TODO FE-05 — endpoint pendiente de confirmación con backend */
  getUmbrales(): Observable<never> {
    return throwError(() => new Error('getUmbrales: endpoint no disponible — pendiente FE-05'));
  }

  /** TODO FE-05 — endpoint pendiente de confirmación con backend */
  updateUmbrales(_umbrales: unknown): Observable<never> {
    return throwError(() => new Error('updateUmbrales: endpoint no disponible — pendiente FE-05'));
  }

  /** TODO FE-05 — endpoint pendiente de confirmación con backend */
  getHistorial(): Observable<never> {
    return throwError(() => new Error('getHistorial: endpoint no disponible — pendiente FE-05'));
  }

  /** TODO FE-05 — endpoint pendiente de confirmación con backend */
  exportarHistorialCSV(): Observable<never> {
    return throwError(() => new Error('exportarHistorialCSV: endpoint no disponible — pendiente FE-05'));
  }
}
