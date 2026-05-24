import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Movimiento, EntradaMovimientoData, SalidaMovimientoData } from '../../models/movimiento.model';
import { MovimientoResponse } from '../api/inventory.api';
import { movimientoFromApi, entradaToRequest, salidaToRequest } from '../mappers/inventory.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private http = inject(HttpClient);

  getMovimientos(): Observable<Movimiento[]> {
    return this.http
      .get<MovimientoResponse[]>(`${API}/inventory/movimientos`)
      .pipe(
        map(list => list.map(movimientoFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  getMovimientoById(id: string): Observable<Movimiento | undefined> {
    return this.http
      .get<MovimientoResponse>(`${API}/inventory/movimientos/${id}`)
      .pipe(
        map(movimientoFromApi),
        catchError(err => throwError(() => err))
      );
  }

  registrarEntrada(data: EntradaMovimientoData): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${API}/inventory/movimientos/entrada`, entradaToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  registrarSalida(data: SalidaMovimientoData): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${API}/inventory/movimientos/salida`, salidaToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }
}
