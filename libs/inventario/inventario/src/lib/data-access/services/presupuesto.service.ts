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
  EstadoCompromiso,
} from '../../models/presupuesto.model';
import {
  PaginatedResponse,
  PresupuestoResponse,
  CompromisoResponse,
  ComprometerRequest,
  PagoRequest,
  RegistrarPresupuestoRequest,
  RegistrarPresupuestoResponse,
  ResumenPresupuestosResponse,
} from '../api/budget.api';
import {
  VencimientoResponse,
  EjecucionMensualResponse,
} from '../api/reporting.api';
import {
  rubrosFromPresupuestoList,
  compromisoFromApi,
  presupuestoDetalleFromApi,
  resumenPresupuestosFromApi,
  afectacionFromCompromiso,
} from '../mappers/budget.mapper';
import { vencimientoFromApi, ejecucionMensualListFromApi } from '../mappers/reporting.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class PresupuestoService {
  private http = inject(HttpClient);

  /**
   * GET /budget/presupuestos?fichaId&vigencia&page&size
   * Retorna lista paginada; aplana todos los rubros de todos los presupuestos.
   */
  getRubros(params?: { fichaId?: string; vigencia?: number; page?: number; size?: number }): Observable<Rubro[]> {
    let httpParams = new HttpParams();
    if (params?.fichaId)  httpParams = httpParams.set('fichaId',  params.fichaId);
    if (params?.vigencia) httpParams = httpParams.set('vigencia', String(params.vigencia));
    if (params?.page !== undefined) httpParams = httpParams.set('page', String(params.page));
    if (params?.size !== undefined) httpParams = httpParams.set('size', String(params.size));

    return this.http
      .get<PaginatedResponse<PresupuestoResponse>>(`${API}/budget/presupuestos`, { params: httpParams })
      .pipe(
        map(resp => rubrosFromPresupuestoList(resp.contenido)),
        catchError(err => throwError(() => err)),
      );
  }

  /**
   * GET /budget/presupuestos/{id}
   * Un único PresupuestoResponse (misma forma, no paginado).
   */
  getPresupuestoById(id: string): Observable<PresupuestoDetalle> {
    return this.http
      .get<PresupuestoResponse>(`${API}/budget/presupuestos/${id}`)
      .pipe(
        map(presupuestoDetalleFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /**
   * POST /budget/presupuestos → 201 { id }
   * Envía el payload real del backend.
   */
  registrarPresupuesto(data: RegistrarPresupuestoData): Observable<{ id: string }> {
    const body: RegistrarPresupuestoRequest = {
      fichaId:           data.fichaId,
      programaFormacion: data.programaFormacion,
      vigencia:          data.vigencia,
      fechaAprobacion:   data.fechaAprobacion,
      rubros:            data.rubros,
    };
    return this.http
      .post<RegistrarPresupuestoResponse>(`${API}/budget/presupuestos`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  // ── Compromisos ──────────────────────────────────────────────────────────────

  /** GET /budget/compromisos?presupuestoId&estado — flat array */
  getCompromisos(presupuestoId?: string, estado?: EstadoCompromiso): Observable<Compromiso[]> {
    let params = new HttpParams();
    if (presupuestoId) params = params.set('presupuestoId', presupuestoId);
    if (estado)        params = params.set('estado', estado);

    return this.http
      .get<CompromisoResponse[]>(`${API}/budget/compromisos`, { params })
      .pipe(
        map(list => list.map(compromisoFromApi)),
        catchError(err => throwError(() => err)),
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

  /** PATCH /budget/compromisos/{id}/anular → 204 No Content */
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

  // ── Implementados (antes pendientes FE-06) ───────────────────────────────────

  /** GET /budget/presupuestos/resumen?vigencia */
  getResumen(vigencia?: number): Observable<ResumenPresupuestosGlobal> {
    let params = new HttpParams();
    if (vigencia !== undefined) params = params.set('vigencia', String(vigencia));
    return this.http
      .get<ResumenPresupuestosResponse>(`${API}/budget/presupuestos/resumen`, { params })
      .pipe(
        map(resumenPresupuestosFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /**
   * Afectaciones — GET /budget/compromisos?presupuestoId
   * Maps each Compromiso → AfectacionPresupuestal.
   */
  getAfectaciones(presupuestoId?: string): Observable<AfectacionPresupuestal[]> {
    let params = new HttpParams();
    if (presupuestoId) params = params.set('presupuestoId', presupuestoId);
    return this.http
      .get<CompromisoResponse[]>(`${API}/budget/compromisos`, { params })
      .pipe(
        map(list => list.map(afectacionFromCompromiso)),
        catchError(err => throwError(() => err)),
      );
  }

  /** GET /reporting/vencimientos?dias=30 */
  getVencimientos(): Observable<VencimientoProximo[]> {
    const params = new HttpParams().set('dias', '30');
    return this.http
      .get<VencimientoResponse[]>(`${API}/reporting/vencimientos`, { params })
      .pipe(
        map(list => list.map(vencimientoFromApi)),
        catchError(err => throwError(() => err)),
      );
  }

  /** GET /reporting/ejecucion-mensual?fichaId&vigencia (both optional) */
  getEjecucionMensual(params?: { fichaId?: string; vigencia?: number }): Observable<EjecucionMensual[]> {
    let httpParams = new HttpParams();
    if (params?.fichaId)  httpParams = httpParams.set('fichaId',  params.fichaId);
    if (params?.vigencia) httpParams = httpParams.set('vigencia', String(params.vigencia));
    return this.http
      .get<EjecucionMensualResponse[]>(`${API}/reporting/ejecucion-mensual`, { params: httpParams })
      .pipe(
        map(ejecucionMensualListFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /** POST /budget/presupuestos/{id}/traslados — body { rubroOrigenId, rubroDestinoId, monto } */
  trasladarRubro(data: TrasladarRubroData): Observable<void> {
    return this.http
      .post<void>(`${API}/budget/presupuestos/${data.presupuestoId}/traslados`, {
        rubroOrigenId:  data.rubroOrigenId,
        rubroDestinoId: data.rubroDestinoId,
        monto:          data.monto,
      })
      .pipe(catchError(err => throwError(() => err)));
  }

  /** TODO FE-06 — exportar: endpoint pendiente */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exportar(_formato: string): Observable<Blob> {
    return throwError(() => new Error('exportar: endpoint no disponible — pendiente FE-06'));
  }
}
