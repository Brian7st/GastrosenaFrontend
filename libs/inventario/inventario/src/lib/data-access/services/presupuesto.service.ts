import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  PresupuestoResumen,
  Programa,
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual,
  RegistrarPresupuestoData,
  TrasladarRubroData,
  MOCK_RESUMEN,
  MOCK_PROGRAMAS,
  MOCK_AFECTACIONES,
  MOCK_VENCIMIENTOS,
  MOCK_EJECUCION_MENSUAL
} from '../../models/presupuesto.model';

@Injectable({ providedIn: 'root' })
export class PresupuestoService {
  getResumen(): Observable<PresupuestoResumen> {
    return of(MOCK_RESUMEN).pipe(delay(300));
  }

  getProgramas(): Observable<Programa[]> {
    return of(MOCK_PROGRAMAS).pipe(delay(300));
  }

  getAfectaciones(): Observable<AfectacionPresupuestal[]> {
    return of(MOCK_AFECTACIONES).pipe(delay(300));
  }

  getVencimientos(): Observable<VencimientoProximo[]> {
    return of(MOCK_VENCIMIENTOS).pipe(delay(300));
  }

  getEjecucionMensual(): Observable<EjecucionMensual[]> {
    return of(MOCK_EJECUCION_MENSUAL).pipe(delay(300));
  }

  registrarPresupuesto(data: RegistrarPresupuestoData): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  trasladarRubro(data: TrasladarRubroData): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(500));
  }

  exportar(formato: string): Observable<Blob> {
    return of(new Blob()).pipe(delay(500));
  }
}
