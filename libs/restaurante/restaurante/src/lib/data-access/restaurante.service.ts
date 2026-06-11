import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Mesa, EstadoMesa, MesaCreateRequest, MesaUpdateRequest,
  EstadoPedido,
  PedidoCreateRequest, PedidoResponse, PedidoResumenResponse,
  DetallePedidoResponse,
  SesionCajaResponse, FacturaResponse,
  AbrirSesionRequest, CerrarSesionRequest, FacturarPedidoRequest
} from '../models/restaurante.model';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private http = inject(HttpClient);

  /** URL del microservicio de restaurante (interceptada por proxy) */
  private readonly mesasUrl = '/api/mesas';
  private readonly pedidosUrl = '/api/pedidos';
  private readonly cajaUrl = '/api/caja';
  private readonly facturasUrl = '/api/facturas';

  // ── Mesas — lectura ─────────────────────────────────────────────────────────

  /**
   * GET /api/mesas  →  Lista todas las mesas activas del backend.
   * Requiere los headers X-Mock-User-Id / X-Mock-User-Role (inyectados
   * por mockSecurityInterceptor en el perfil dev).
   */
  obtenerMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.mesasUrl);
  }

  obtenerMesasInactivas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.mesasUrl}/inactivas`);
  }

  // ── Mesas — escritura ───────────────────────────────────────────────────────

  /**
   * PATCH /api/mesas/{id}/estado?nuevoEstado=X
   * Cambia el estado de una mesa y devuelve el MesaResponse actualizado.
   */
  cambiarEstadoMesa(id: string, nuevoEstado: EstadoMesa): Observable<Mesa> {
    const params = new HttpParams().set('nuevoEstado', nuevoEstado);
    return this.http.patch<Mesa>(`${this.mesasUrl}/${id}/estado`, null, { params });
  }

  /**
   * POST /api/mesas
   * Crea una nueva mesa. El backend asigna estado=LIBRE y activo=true por defecto.
   */
  crearMesa(request: MesaCreateRequest): Observable<Mesa> {
    return this.http.post<Mesa>(this.mesasUrl, request);
  }

  /**
   * PUT /api/mesas/{id}
   * Actualiza nombre, capacidad y/o zona de una mesa existente.
   */
  editarMesa(id: string, request: MesaUpdateRequest): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.mesasUrl}/${id}`, request);
  }

  /**
   * PATCH /api/mesas/{id}/activar  |  PATCH /api/mesas/{id}/desactivar
   */
  cambiarEstadoActivo(id: string, activar: boolean): Observable<Mesa> {
    const accion = activar ? 'activar' : 'desactivar';
    return this.http.patch<Mesa>(`${this.mesasUrl}/${id}/${accion}`, null);
  }

  // ── Pedidos — lectura ───────────────────────────────────────────────────────

  obtenerPedidoPorId(id: string): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.pedidosUrl}/${id}`);
  }

  listarTodosPedidos(): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(this.pedidosUrl);
  }

  misPedidos(): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.pedidosUrl}/mis-pedidos`);
  }

  pedidosPorEstado(estado: EstadoPedido): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.pedidosUrl}/estado/${estado}`);
  }

  pedidosPorMesa(mesaId: string): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.pedidosUrl}/mesa/${mesaId}`);
  }

  // ── Pedidos — escritura ──────────────────────────────────────────────────────

  crearPedido(request: PedidoCreateRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.pedidosUrl, request);
  }

  confirmarPedido(id: string): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.pedidosUrl}/${id}/confirmar`, null);
  }

  entregarPedido(id: string): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.pedidosUrl}/${id}/entregar`, null);
  }

  cancelarPedido(id: string, motivo?: string): Observable<PedidoResponse> {
    let params = new HttpParams();
    if (motivo) {
      params = params.set('motivo', motivo);
    }
    return this.http.patch<PedidoResponse>(`${this.pedidosUrl}/${id}/cancelar`, null, { params });
  }

  // ── Caja y Facturación ───────────────────────────────────────────────────────

  abrirSesion(request: AbrirSesionRequest): Observable<SesionCajaResponse> {
    return this.http.post<SesionCajaResponse>(`${this.cajaUrl}/sesion/abrir`, request);
  }

  cerrarSesion(id: string, request: CerrarSesionRequest): Observable<SesionCajaResponse> {
    return this.http.patch<SesionCajaResponse>(`${this.cajaUrl}/sesion/${id}/cerrar`, request);
  }

  obtenerSesionActiva(): Observable<SesionCajaResponse> {
    return this.http.get<SesionCajaResponse>(`${this.cajaUrl}/sesion/activa`);
  }

  obtenerSesionPorId(id: string): Observable<SesionCajaResponse> {
    return this.http.get<SesionCajaResponse>(`${this.cajaUrl}/sesion/${id}`);
  }

  facturarPedido(request: FacturarPedidoRequest): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(this.facturasUrl, request);
  }

  anularFactura(id: string): Observable<FacturaResponse> {
    return this.http.patch<FacturaResponse>(`${this.facturasUrl}/${id}/anular`, null);
  }

  obtenerFacturaPorId(id: string): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.facturasUrl}/${id}`);
  }

  obtenerFacturaPorNumero(numero: string): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.facturasUrl}/numero/${numero}`);
  }

  obtenerFacturasDeSesion(sesionId: string): Observable<FacturaResponse[]> {
    return this.http.get<FacturaResponse[]>(`${this.facturasUrl}/sesion/${sesionId}`);
  }

  descargarFacturaPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.facturasUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
