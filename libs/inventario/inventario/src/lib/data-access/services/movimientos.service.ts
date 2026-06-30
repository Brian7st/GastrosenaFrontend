import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Movimiento,
  DocumentoMovimiento,
  SalidaMovimientoData,
  ReservaMovimientoData,
  LiberacionMovimientoData,
  AjusteMovimientoData,
} from '../../models/movimiento.model';
import { ExistenciaProducto } from '../../models/inventario.model';
import { MovimientoPageResponse, ExistenciaResponse, DocumentoPageResponse, DocumentoDetalleResponse } from '../api/inventory.api';
import { KardexValorizadoItemResponse } from '../api/reporting.api';
import { KardexValorizadoItem } from '../../models/reporting.model';
import {
  movimientoFromApi,
  existenciaFromApi,
  salidaToRequest,
  reservaToRequest,
  liberacionToRequest,
  ajusteToRequest,
  movimientoPageFromApi,
  documentoPageFromApi,
} from '../mappers/inventory.mapper';
import { kardexValorizadoFromApi } from '../mappers/reporting.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private http = inject(HttpClient);

  // ── Documentos agrupados ────────────────────────────────────────────────────

  /**
   * GET /inventory/movimientos?pagina=&tamano=
   * Listado paginado de documentos de movimiento (agrupados por documento).
   */
  getDocumentos(
    pagina = 0,
    tamano = 20,
  ): Observable<{
    documentos: DocumentoMovimiento[];
    totalPaginas: number;
    totalElementos: number;
    paginaActual: number;
    tamano: number;
  }> {
    const params = new HttpParams()
      .set('pagina', String(pagina))
      .set('tamano', String(tamano));
    return this.http
      .get<DocumentoPageResponse>(`${API}/inventory/movimientos`, { params })
      .pipe(
        map(resp => documentoPageFromApi(resp)),
        catchError(err => throwError(() => err))
      );
  }

  /**
   * GET /inventory/movimientos/documento/{documentoId}?tipo=ENTRADA|SALIDA
   * Retorna los bienes de un documento específico.
   */
  getBienesPorDocumento(
    documentoId: string,
    tipo: 'ENTRADA' | 'SALIDA',
  ): Observable<{ tipo: 'ENTRADA' | 'SALIDA'; documentoId: string; numeroDocumento: string | null; bienes: Movimiento[] }> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http
      .get<DocumentoDetalleResponse>(`${API}/inventory/movimientos/documento/${documentoId}`, { params })
      .pipe(
        map(resp => ({
          tipo: resp.tipo,
          documentoId: resp.documentoId,
          numeroDocumento: resp.numeroDocumento,
          bienes: resp.bienes.map(movimientoFromApi),
        })),
        catchError(err => throwError(() => err))
      );
  }

  // ── Kardex ──────────────────────────────────────────────────────────────────

  /**
   * GET /inventory/movimientos/todos?pagina=0&tamano=50
   * Listado global PLANO de TODOS los movimientos (entradas + salidas + ajustes),
   * sin agrupar por documento, enriquecido por el backend con nombre y unidad.
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
      .get<MovimientoPageResponse>(`${API}/inventory/movimientos/todos`, { params })
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

  // ── Movimientos de salida ───────────────────────────────────────────────────

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

  /**
   * GET /api/reportes/uso-bienes — reporte de uso/movimientos de bienes en un
   * rango de fechas. Lo genera ga-ms-reportes. formato: PDF (default) o EXCEL → xlsx.
   */
  exportarUsoBienes(fechaInicio: string, fechaFin: string, formato: string, tipo?: 'ENTRADA' | 'SALIDA'): Observable<Blob> {
    const fmt = formato.toLowerCase() === 'pdf' ? 'PDF' : 'EXCEL';
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin)
      .set('formato', fmt);
    if (tipo) params = params.set('tipo', tipo);
    return this.http
      .get(`/api/reportes/uso-bienes`, { params, responseType: 'blob' })
      .pipe(catchError(err => throwError(() => err)));
  }
}
