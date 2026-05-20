import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Movimiento } from '../../models/movimiento.model';
import { MOVIMIENTOS_MOCK } from '../../models/movimiento.mock';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  getMovimientos(): Observable<Movimiento[]> {
    return of(MOVIMIENTOS_MOCK).pipe(delay(500));
  }

  getMovimientoById(id: string): Observable<Movimiento | undefined> {
    const mov = MOVIMIENTOS_MOCK.find(m => m.id === id);
    return of(mov).pipe(delay(300));
  }

  registrarEntrada(data: any): Observable<any> {
    return of({ success: true, data }).pipe(delay(500));
  }

  registrarSalida(data: any): Observable<any> {
    return of({ success: true, data }).pipe(delay(500));
  }
}
