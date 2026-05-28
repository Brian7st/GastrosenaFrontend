import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  PresupuestoDetalle,
  ResumenPresupuestosGlobal,
  Rubro,
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual,
  RegistrarPresupuestoData,
  TrasladarRubroData,
  Compromiso,
  ComprometerData,
  PagoData,
} from '../../models/presupuesto.model';
import {
  PresupuestoResponse,
  PresupuestoDetalleResponse,
  ResumenPresupuestosResponse,
  CompromisoResponse,
  ComprometerRequest,
  PagoRequest,
} from '../api/budget.api';
import { rubroFromApi, compromisoFromApi, presupuestoDetalleFromApi, resumenPresupuestosFromApi } from '../mappers/budget.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class PresupuestoService {
  private http = inject(HttpClient);

  getRubros(): Observable<Rubro[]> {
    return this.http
      .get<PresupuestoResponse[]>(`${API}/budget/presupuestos`)
      .pipe(
        map(list => list.map(rubroFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /budget/presupuestos/resumen?vigencia? */
  getResumen(vigencia?: number): Observable<ResumenPresupuestosGlobal> {
    let params = new HttpParams();
    if (vigencia) params = params.set('vigencia', String(vigencia));
    return this.http
      .get<ResumenPresupuestosResponse>(`${API}/budget/presupuestos/resumen`, { params })
      .pipe(
        map(resumenPresupuestosFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /budget/presupuestos/{id} */
  getPresupuestoById(id: string): Observable<PresupuestoDetalle> {
    return this.http
      .get<PresupuestoDetalleResponse>(`${API}/budget/presupuestos/${id}`)
      .pipe(
        map(presupuestoDetalleFromApi),
        catchError(err => throwError(() => err))
      );
  }

  registrarPresupuesto(data: RegistrarPresupuestoData): Observable<{ success: boolean }> {
    return this.http
      .post<PresupuestoResponse>(`${API}/budget/presupuestos`, data)
      .pipe(
        map(() => ({ success: true })),
        catchError(err => throwError(() => err))
      );
  }

  // ── Compromisos ──────────────────────────────────────────────────────────────

  /** GET /budget/compromisos — lista filtrada por presupuesto y/o estado */
  getCompromisos(presupuestoId?: string, estado?: 'VIGENTE' | 'ANULADO'): Observable<Compromiso[]> {
    let params = new HttpParams();
    if (presupuestoId) params = params.set('presupuestoId', presupuestoId);
    if (estado)        params = params.set('estado', estado);

    return this.http
      .get<CompromisoResponse[]>(`${API}/budget/compromisos`, { params })
      .pipe(
        map(list => list.map(compromisoFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /budget/compromisos — aplica retención ZESE si aplicarZESE=true */
  comprometer(data: ComprometerData): Observable<{ id: string }> {
    const body: ComprometerRequest = {
      presupuestoId: data.presupuestoId,
      rubroId:       data.rubroId,
      gilId:         data.gilId,
      facturaId:     data.facturaId,
      fichaId:       data.fichaId,
      programaId:    data.programaId,
      concepto:      data.concepto,
      monto:         data.monto,
      aplicarZESE:   data.aplicarZESE,
      fecha:         data.fecha,
    };
    return this.http
      .post<{ id: string }>(`${API}/budget/compromisos`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /budget/compromisos/{id}/anular — 422 si ya anulado */
  anularCompromiso(id: string): Observable<void> {
    return this.http
      .patch<void>(`${API}/budget/compromisos/${id}/anular`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /budget/compromisos/{id}/pagos */
  registrarPago(compromisoId: string, data: PagoData): Observable<{ id: string }> {
    const body: PagoRequest = {
      cufeFuenteId: data.cufeFuenteId,
      monto:        data.monto,
      fecha:        data.fecha,
    };
    return this.http
      .post<{ id: string }>(`${API}/budget/compromisos/${compromisoId}/pagos`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  // ── FE-06: los métodos siguientes requieren alineación con backend ──

  /** TODO FE-06 — sin endpoint de afectaciones */
  getAfectaciones(): Observable<AfectacionPresupuestal[]> {
    return throwError(() => new Error('getAfectaciones: endpoint no disponible — pendiente FE-06'));
  }

  /** TODO FE-06 — sin endpoint de vencimientos */
  getVencimientos(): Observable<VencimientoProximo[]> {
    return throwError(() => new Error('getVencimientos: endpoint no disponible — pendiente FE-06'));
  }

  /** TODO FE-06 — sin endpoint de ejecución mensual */
  getEjecucionMensual(): Observable<EjecucionMensual[]> {
    return throwError(() => new Error('getEjecucionMensual: endpoint no disponible — pendiente FE-06'));
  }

  /** TODO FE-06 — sin endpoint de traslado */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trasladarRubro(_data: TrasladarRubroData): Observable<{ success: boolean }> {
    return throwError(() => new Error('trasladarRubro: endpoint no disponible — pendiente FE-06'));
  }

  /** TODO FE-06 — sin endpoint de exportación */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exportar(_formato: string): Observable<Blob> {
    return throwError(() => new Error('exportar: endpoint no disponible — pendiente FE-06'));
  }
}
