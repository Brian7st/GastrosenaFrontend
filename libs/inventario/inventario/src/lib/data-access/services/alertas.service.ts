import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Alerta, UmbralConfig } from '../../models/alerta.model';
import { ResumenAlertas } from '../../models/reporting.model';
import { AlertaResponse, UmbralStockResponse, ActualizarUmbralRequest } from '../api/alerts.api';
import { ResumenAlertasResponse } from '../api/reporting.api';
import { alertaFromApi, umbralFromApi } from '../mappers/alerts.mapper';
import { resumenAlertasFromApi } from '../mappers/reporting.mapper';

const API = 'http://localhost:8080/api/v1';

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

  // ── Resumen Alertas (Reporting) ───────────────────────────────────────────────

  /** GET /reporting/alertas/resumen?destinatarioId? */
  getResumenAlertas(destinatarioId?: string): Observable<ResumenAlertas> {
    let params = new HttpParams();
    if (destinatarioId) params = params.set('destinatarioId', destinatarioId);
    return this.http
      .get<ResumenAlertasResponse>(`${API}/reporting/alertas/resumen`, { params })
      .pipe(
        map(resumenAlertasFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** TODO FE-05 — sin endpoint de exportación CSV confirmado con backend */
  exportarHistorialCSV(): Observable<never> {
    return throwError(() => new Error('exportarHistorialCSV: endpoint no disponible — pendiente confirmación backend'));
  }
}
