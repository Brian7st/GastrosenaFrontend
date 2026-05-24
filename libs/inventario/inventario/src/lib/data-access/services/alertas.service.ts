import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Alerta, UmbralConfig } from '../../models/alerta.model';
import { AlertaResponse, UmbralStockResponse, ActualizarUmbralRequest } from '../api/alerts.api';
import { alertaFromApi, umbralFromApi } from '../mappers/alerts.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AlertasService {
  private http = inject(HttpClient);

  // ── Alertas ──────────────────────────────────────────────────────────────────

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

  // ── Umbrales ─────────────────────────────────────────────────────────────────

  /** GET /alerts/alertas/umbrales — lista todos los productos con existencia registrada */
  getUmbrales(): Observable<UmbralConfig[]> {
    return this.http
      .get<UmbralStockResponse[]>(`${API}/alerts/alertas/umbrales`)
      .pipe(
        map(list => list.map(umbralFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** PUT /alerts/alertas/umbrales/{productoId} — actualiza el mínimo de un producto */
  updateUmbral(productoId: string, nuevoMinimo: number): Observable<UmbralStockResponse> {
    const body: ActualizarUmbralRequest = { nuevoMinimo };
    return this.http
      .put<UmbralStockResponse>(`${API}/alerts/alertas/umbrales/${productoId}`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  // ── Historial (Reporting) ─────────────────────────────────────────────────────

  /** TODO FE-05 — wired en reporting: GET /reporting/alertas/resumen */
  getHistorial(): Observable<never> {
    return throwError(() => new Error('getHistorial: usar /reporting/alertas/resumen — pendiente FE-05'));
  }

  /** TODO FE-05 — sin endpoint de exportación CSV */
  exportarHistorialCSV(): Observable<never> {
    return throwError(() => new Error('exportarHistorialCSV: endpoint no disponible — pendiente FE-05'));
  }
}
