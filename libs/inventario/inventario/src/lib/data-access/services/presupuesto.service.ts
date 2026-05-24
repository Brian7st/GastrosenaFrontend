import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  PresupuestoResumen,
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
import { PresupuestoResponse, CompromisoResponse, ComprometerRequest, PagoRequest } from '../api/budget.api';
import { rubroFromApi, compromisoFromApi } from '../mappers/budget.mapper';

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

  /** Resumen derivado de los rubros — FE-06 alineará con el contrato oficial */
  getResumen(): Observable<PresupuestoResumen> {
    return this.getRubros().pipe(
      map(rubros => ({
        vigenciaFiscal: new Date().getFullYear(),
        corte: new Date().toLocaleDateString('es-CO'),
        totalApropiacion:   rubros.reduce((s, r) => s + r.montoAsignado, 0),
        totalComprometido:  rubros.reduce((s, r) => s + r.montoComprometido, 0),
        totalPagado:        rubros.reduce((s, r) => s + r.montoPagado, 0),
        totalDisponible:    rubros.reduce((s, r) => s + r.saldoDisponible, 0),
        totalZese:          rubros.reduce((s, r) => s + r.retencionZese, 0),
        porcentajeEjecucion: rubros.length
          ? rubros.reduce((s, r) => s + r.porcentajeEjecucion, 0) / rubros.length
          : 0,
        variacionAnual: 0, // TODO FE-06: sin endpoint disponible aún
      }))
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
  trasladarRubro(_data: TrasladarRubroData): Observable<{ success: boolean }> {
    return throwError(() => new Error('trasladarRubro: endpoint no disponible — pendiente FE-06'));
  }

  /** TODO FE-06 — sin endpoint de exportación */
  exportar(_formato: string): Observable<Blob> {
    return throwError(() => new Error('exportar: endpoint no disponible — pendiente FE-06'));
  }
}
