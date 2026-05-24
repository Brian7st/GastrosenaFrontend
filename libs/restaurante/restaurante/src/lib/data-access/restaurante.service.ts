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
  /** URL base del microservicio de restaurante (dev: localhost:8080) */
  private readonly mesasUrl   = 'http://localhost:8080/api/mesas';
  private readonly pedidosUrl = 'http://localhost:8080/api/pedidos';
  private readonly cajaUrl    = 'http://localhost:8080/api/caja';

  /**
   * GET /api/mesas  →  Lista todas las mesas activas del backend.
   * Requiere los headers X-Mock-User-Id / X-Mock-User-Role (inyectados
   * por mockSecurityInterceptor en el perfil dev).
   */
  obtenerMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.mesasUrl);
  }

  /**
   * PATCH /api/mesas/{id}/estado?nuevoEstado=X
   * Cambia el estado de una mesa y devuelve el MesaResponse actualizado.
   * El query param es obligatorio según la firma del controlador Java:
   *   @PatchMapping("/{id}/estado")
   *   public ResponseEntity<MesaResponse> cambiarEstado(@PathVariable UUID id,
   *                                                     @RequestParam EstadoMesa nuevoEstado)
   */
  cambiarEstadoMesa(id: string, nuevoEstado: EstadoMesa): Observable<Mesa> {
    const params = new HttpParams().set('nuevoEstado', nuevoEstado);
    return this.http.patch<Mesa>(`${this.mesasUrl}/${id}/estado`, null, { params });
  }

  /**
   * POST /api/mesas
   * Crea una nueva mesa. El backend asigna estado=LIBRE y activo=true por defecto
   * (ver MesaMapper.toEntity). Devuelve el MesaResponse con el UUID generado.
   */
  crearMesa(request: MesaCreateRequest): Observable<Mesa> {
    return this.http.post<Mesa>(this.mesasUrl, request);
  }

  /**
   * PUT /api/mesas/{id}
   * Actualiza nombre, capacidad y/o zona de una mesa existente.
   * Campos no enviados son ignorados por el mapper del backend.
   */
  editarMesa(id: string, request: MesaUpdateRequest): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.mesasUrl}/${id}`, request);
  }

  /**
   * PATCH /api/mesas/{id}/activar  |  PATCH /api/mesas/{id}/desactivar
   * El backend tiene dos endpoints separados (ver MesaController):
   *   @PatchMapping("/{id}/activar")    → activo = true
   *   @PatchMapping("/{id}/desactivar") → activo = false
   */
  cambiarEstadoActivo(id: string, activar: boolean): Observable<Mesa> {
    const accion = activar ? 'activar' : 'desactivar';
    return this.http.patch<Mesa>(`${this.mesasUrl}/${id}/${accion}`, null);
  }

  // ── Pedidos — lectura ───────────────────────────────────────────────────────

  /**
   * GET /api/pedidos/{id}
   * Devuelve el pedido completo con sus detalles (PedidoResponse).
   */
  obtenerPedidoPorId(id: string): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.pedidosUrl}/${id}`);
  }

  /**
   * GET /api/pedidos
   * Lista todos los pedidos (rol INSTRUCTOR / ADMIN).
   * Devuelve PedidoResumenResponse[] — sin detalles de ítems.
   */
  listarTodosPedidos(): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(this.pedidosUrl);
  }

  /**
   * GET /api/pedidos/mis-pedidos
   * Lista solo los pedidos del mesero autenticado (X-Mock-User-Id).
   */
  misPedidos(): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.pedidosUrl}/mis-pedidos`);
  }

  /**
   * GET /api/pedidos/estado/{estado}
   * Filtra pedidos por EstadoPedido.
   */
  pedidosPorEstado(estado: EstadoPedido): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.pedidosUrl}/estado/${estado}`);
  }

  /**
   * GET /api/pedidos/mesa/{mesaId}
   * Devuelve todos los pedidos asociados a una mesa (UUID).
   */
  pedidosPorMesa(mesaId: string): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.pedidosUrl}/mesa/${mesaId}`);
  }

  // ── Pedidos — escritura ──────────────────────────────────────────────────────

  /**
   * POST /api/pedidos
   * Crea un pedido en estado BORRADOR. Devuelve PedidoResponse con UUID asignado.
   * mesaId es @NotNull y detalles @NotEmpty en el backend.
   */
  crearPedido(request: PedidoCreateRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.pedidosUrl, request);
  }

  /**
   * PATCH /api/pedidos/{id}/confirmar
   * Transición: BORRADOR → ENVIADO_COCINA.
   * Dispara eventos RabbitMQ hacia el microservicio de Cocina.
   */
  confirmarPedido(id: string): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.pedidosUrl}/${id}/confirmar`, null);
  }

  /**
   * PATCH /api/pedidos/{id}/entregar
   * Transición: LISTO_PARA_SERVIR → ENTREGADO.
   */
  entregarPedido(id: string): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.pedidosUrl}/${id}/entregar`, null);
  }

  /**
   * PATCH /api/pedidos/{id}/cancelar
   * Cancela el pedido independientemente del estado actual.
   */
  cancelarPedido(id: string): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.pedidosUrl}/${id}/cancelar`, null);
  }

  // ── Caja y Facturación ───────────────────────────────────────────────────────

  // -- Sesión --

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

  // -- Facturación --

  facturarPedido(request: FacturarPedidoRequest): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(`${this.cajaUrl}/facturar`, request);
  }

  anularFactura(id: string): Observable<FacturaResponse> {
    return this.http.patch<FacturaResponse>(`${this.cajaUrl}/facturas/${id}/anular`, null);
  }

  obtenerFacturaPorId(id: string): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.cajaUrl}/facturas/${id}`);
  }

  obtenerFacturaPorNumero(numero: string): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.cajaUrl}/facturas/numero/${numero}`);
  }

  obtenerFacturasDeSesion(sesionId: string): Observable<FacturaResponse[]> {
    return this.http.get<FacturaResponse[]>(`${this.cajaUrl}/sesion/${sesionId}/facturas`);
  }
}
