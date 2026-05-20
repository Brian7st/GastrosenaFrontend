import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Alerta,
  RegistroHistorial,
  UmbralConfig,
  MOCK_ALERTAS,
  MOCK_HISTORIAL,
  MOCK_UMBRALES,
} from '../../models/alerta.model';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  getAlertas(): Observable<Alerta[]> {
    return of([...MOCK_ALERTAS]).pipe(delay(300));
  }

  getAlertaById(id: string): Observable<Alerta | undefined> {
    const alerta = MOCK_ALERTAS.find(a => a.id === id);
    return of(alerta).pipe(delay(200));
  }

  resolverAlerta(id: string, data: Record<string, unknown>): Observable<boolean> {
    console.log(`[AlertasService] Resolviendo alerta ${id}`, data);
    return of(true).pipe(delay(500));
  }

  updateUmbrales(umbrales: UmbralConfig[]): Observable<boolean> {
    console.log('[AlertasService] Umbrales actualizados', umbrales);
    return of(true).pipe(delay(400));
  }

  getHistorial(): Observable<RegistroHistorial[]> {
    return of([...MOCK_HISTORIAL]).pipe(delay(300));
  }

  getUmbrales(): Observable<UmbralConfig[]> {
    return of([...MOCK_UMBRALES]).pipe(delay(300));
  }
}
