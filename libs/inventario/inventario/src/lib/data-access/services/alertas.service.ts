import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Alerta, MOCK_ALERTAS } from '../../models/alerta.model';

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

  resolverAlerta(id: string, data: any): Observable<boolean> {
    // Simulamos la resolución exitosa
    console.log(`[AlertasService] Resolviendo alerta ${id}`, data);
    return of(true).pipe(delay(500));
  }

  updateUmbrales(umbrales: any): Observable<boolean> {
    // Simulamos guardado de umbrales
    console.log('[AlertasService] Umbrales actualizados', umbrales);
    return of(true).pipe(delay(400));
  }
}
