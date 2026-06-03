import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
import { MovimientoResponse, MovimientoPageResponse, ExistenciaResponse } from '../api/inventory.api';
import { KardexValorizadoItemResponse } from '../api/reporting.api';
import { KardexValorizadoItem } from '../../models/reporting.model';
import {
  movimientoFromApi,
  existenciaFromApi,
  entradaToRequest,
  salidaToRequest,
  reservaToRequest,
  liberacionToRequest,
  ajusteToRequest,
  movimientoPageFromApi,
} from '../mappers/inventory.mapper';
import { kardexValorizadoFromApi } from '../mappers/reporting.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private http = inject(HttpClient);

  // ── Kardex ──────────────────────────────────────────────────────────────────

  /**
   * GET /inventory/movimientos?pagina=0&tamano=50
   * Listado global de TODOS los movimientos (entradas + salidas + ajustes),
   * enriquecido por el backend con nombre y unidad de medida del catálogo.
   */
  getMovimientos(
    pagina = 0,
    tamano = 10,
    tipo?: string,
  ): Observable<{ movimientos: Movimiento[]; totalPaginas: number; totalElementos: number }> {
    let params = new HttpParams()
      .set('pagina', String(pagina))
      .set('tamano', String(tamano));
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http
      .get<MovimientoPageResponse>(`${API}/inventory/movimientos`, { params })
      .pipe(
        map(resp => movimientoPageFromApi(resp)),
        catchError(err => throwError(() => err))
      );
  }

  /**
   * GET /inventory/movimientos/{productoId}?pagina=0&tamano=10
   * El Swagger declara params `pagina`/`tamano` (español) y respuesta genérica `object`.
   * El mapper `movimientoPageFromApi` normaliza ambas convenciones de campo.
   */
  getKardex(
    productoId: string,
    pagina = 0,
    tamano = 10,
  ): Observable<{ movimientos: Movimiento[]; totalPaginas: number; totalElementos: number }> {
    const params = new HttpParams()
      .set('pagina', String(pagina))
      .set('tamano', String(tamano));
    return this.http
      .get<MovimientoPageResponse>(`${API}/inventory/movimientos/${productoId}`, { params })
      .pipe(
        map(resp => movimientoPageFromApi(resp)),
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

  /** POST /inventory/movimientos/entrada — 201 No Content */
  registrarEntrada(data: EntradaMovimientoData): Observable<void> {
    return this.http
      .post<void>(`${API}/inventory/movimientos/entrada`, entradaToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  /** POST /inventory/movimientos/salida — 201 No Content */
  registrarSalida(data: SalidaMovimientoData): Observable<void> {
    return this.http
      .post<void>(`${API}/inventory/movimientos/salida`, salidaToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  // ── Reserva / Liberación / Ajuste ───────────────────────────────────────────

  registrarReserva(data: ReservaMovimientoData): Observable<void> {
    return this.http
      .post<void>(`${API}/inventory/movimientos/reserva`, reservaToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  registrarLiberacion(data: LiberacionMovimientoData): Observable<void> {
    return this.http
      .post<void>(`${API}/inventory/movimientos/liberacion`, liberacionToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  registrarAjuste(data: AjusteMovimientoData): Observable<void> {
    return this.http
      .post<void>(`${API}/inventory/movimientos/ajuste`, ajusteToRequest(data))
      .pipe(catchError(err => throwError(() => err)));
  }

  /** GET /reporting/kardex?productoId?&desde?&hasta? (ISO_DATE_TIME) */
  getKardexValorizado(params?: {
    productoId?: string;
    desde?:      string;
    hasta?:      string;
  }): Observable<KardexValorizadoItem[]> {
    let httpParams = new HttpParams();
    if (params?.productoId) httpParams = httpParams.set('productoId', params.productoId);
    if (params?.desde)      httpParams = httpParams.set('desde',      params.desde);
    if (params?.hasta)      httpParams = httpParams.set('hasta',      params.hasta);
    return this.http
      .get<KardexValorizadoItemResponse[]>(`${API}/reporting/kardex`, { params: httpParams })
      .pipe(
        map(list => list.map(kardexValorizadoFromApi)),
        catchError(err => throwError(() => err))
      );
  }
}
