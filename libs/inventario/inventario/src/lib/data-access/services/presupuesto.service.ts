import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
} from '../../models/presupuesto.model';
import { PresupuestoResponse } from '../api/budget.api';
import { rubroFromApi } from '../mappers/budget.mapper';

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
