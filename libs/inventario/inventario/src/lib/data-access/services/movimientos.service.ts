import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Movimiento,
  EntradaMovimientoData,
  SalidaMovimientoData,
  ReservaMovimientoData,
  LiberacionMovimientoData,
  AjusteMovimientoData,
} from '../../models/movimiento.model';
import { ExistenciaProducto } from '../../models/inventario.model';
import { MovimientoResponse, ExistenciaResponse } from '../api/inventory.api';
import {
  movimientoFromApi,
  existenciaFromApi,
  entradaToRequest,
  salidaToRequest,
  reservaToRequest,
  liberacionToRequest,
  ajusteToRequest,
} from '../mappers/inventory.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private http = inject(HttpClient);

  // ── Kardex ──────────────────────────────────────────────────────────────────

  /** Historial de movimientos de un producto (GET /inventory/movimientos/{productoId}) */
  getKardex(productoId: string): Observable<Movimiento[]> {
    return this.http
      .get<MovimientoResponse[]>(`${API}/inventory/movimientos/${productoId}`)
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

  // ── Existencias ─────────────────────────────────────────────────────────────

  /** Stock de un producto (GET /inventory/existencias/{productoId}) */
  getExistencia(productoId: string): Observable<ExistenciaProducto> {
    return this.http
      .get<ExistenciaResponse>(`${API}/inventory/existencias/${productoId}`)
      .pipe(
        map(existenciaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** Productos bajo el mínimo de stock (GET /inventory/existencias/bajo-minimo) */
  getExistenciasBajoMinimo(): Observable<ExistenciaProducto[]> {
    return this.http
      .get<ExistenciaResponse[]>(`${API}/inventory/existencias/bajo-minimo`)
      .pipe(
        map(list => list.map(existenciaFromApi)),
        catchError(err => throwError(() => err))
      );
  }

  // ── Movimientos de entrada / salida ─────────────────────────────────────────

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

  // ── Reserva / Liberación / Ajuste ───────────────────────────────────────────

  registrarReserva(data: ReservaMovimientoData): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${API}/inventory/movimientos/reserva`, reservaToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  registrarLiberacion(data: LiberacionMovimientoData): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${API}/inventory/movimientos/liberacion`, liberacionToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  registrarAjuste(data: AjusteMovimientoData): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${API}/inventory/movimientos/ajuste`, ajusteToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }
}
