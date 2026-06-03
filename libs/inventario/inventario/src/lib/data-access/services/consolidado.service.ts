import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Consolidado, GenerarConsolidadoData, ElegibleConsolidado } from '../../models/consolidado.model';
import { EjecucionPresupuestal } from '../../models/reporting.model';
import { PaginatedResponse, ConsolidadoResponse, GenerarConsolidadoRequest, ElegibleConsolidadoResponse } from '../api/budget.api';
import { EjecucionPresupuestalItemResponse } from '../api/reporting.api';
import { consolidadoFromApi, elegibleFromApi } from '../mappers/budget.mapper';
import { ejecucionPresupuestalFromApi } from '../mappers/reporting.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ConsolidadoService {
  private http = inject(HttpClient);

  /** GET /budget/consolidados?page&size → paginado */
  getConsolidados(params?: { page?: number; size?: number }): Observable<Consolidado[]> {
    let httpParams = new HttpParams();
    if (params?.page !== undefined) httpParams = httpParams.set('page', String(params.page));
    if (params?.size !== undefined) httpParams = httpParams.set('size', String(params.size));

    return this.http
      .get<PaginatedResponse<ConsolidadoResponse>>(`${API}/budget/consolidados`, { params: httpParams })
      .pipe(
        map(resp => resp.contenido.map(consolidadoFromApi)),
        catchError(err => throwError(() => err)),
      );
  }

  /**
   * GET /budget/consolidados/{numero}
   * El path variable es el NÚMERO (number), no el UUID id.
   */
  getConsolidadoPorNumero(numero: number): Observable<Consolidado> {
    return this.http
      .get<ConsolidadoResponse>(`${API}/budget/consolidados/${numero}`)
      .pipe(
        map(consolidadoFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /**
   * POST /budget/consolidados → 201 { id }
   * Body: { lineas: LineaConsolidadoInput[], generadoPor: string }
   *
   * TODO: El backend NO tiene un endpoint "GILs elegibles para consolidar" que
   * provea facturaId/cufe/numeroFactura. La fuente más cercana es
   * GET /budget/compromisos?estado=APLICADO (da id, gilId, concepto, monto,
   * montoRetencionZese, fecha) pero NO tiene facturaId/cufe/numeroFactura.
   * Los campos completos deben venir de otra fuente (gap de backend).
   */
  generarConsolidado(data: GenerarConsolidadoData): Observable<{ id: string }> {
    const body: GenerarConsolidadoRequest = {
      lineas:      data.lineas,
      generadoPor: data.generadoPor,
    };
    return this.http
      .post<{ id: string }>(`${API}/budget/consolidados`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /**
   * PATCH /budget/consolidados/{numero}/reversar → 204
   * Path variable is the NUMERO (number), not the UUID id.
   */
  reversarConsolidado(numero: number): Observable<void> {
    return this.http
      .patch<void>(`${API}/budget/consolidados/${numero}/reversar`, {})
      .pipe(catchError(err => throwError(() => err)));
  }

  /** GET /budget/consolidados/elegibles → compromisos elegibles para consolidar */
  getElegibles(): Observable<ElegibleConsolidado[]> {
    return this.http
      .get<ElegibleConsolidadoResponse[]>(`${API}/budget/consolidados/elegibles`)
      .pipe(
        map(list => list.map(elegibleFromApi)),
        catchError(err => throwError(() => err)),
      );
  }

  /** GET /reporting/ejecucion-presupuestal?fichaId?&vigencia? */
  getEjecucionPresupuestal(
    params?: { fichaId?: string; vigencia?: number },
  ): Observable<EjecucionPresupuestal[]> {
    let httpParams = new HttpParams();
    if (params?.fichaId)  httpParams = httpParams.set('fichaId',  params.fichaId);
    if (params?.vigencia) httpParams = httpParams.set('vigencia', String(params.vigencia));
    return this.http
      .get<EjecucionPresupuestalItemResponse[]>(
        `${API}/reporting/ejecucion-presupuestal`,
        { params: httpParams },
      )
      .pipe(
        map(list => list.map(ejecucionPresupuestalFromApi)),
        catchError(err => throwError(() => err)),
      );
  }
}
