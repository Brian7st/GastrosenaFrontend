import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Mesa, EstadoMesa, MesaCreateRequest, MesaUpdateRequest, PedidoResumenResponse, EstadoPedidoBackend, PedidoCreateRequest } from '../models/restaurante.model';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private http = inject(HttpClient);
  /** URL del microservicio de restaurante (dev: localhost:8080) */
  private readonly mesasUrl    = 'http://localhost:8080/api/mesas';
  private readonly apiUrl      = '/api/pedidos';

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

  /**
   * Obtiene la lista de pedidos en un estado específico
   */
  getPedidosPorEstado(estado: EstadoPedidoBackend): Observable<PedidoResumenResponse[]> {
    return this.http.get<PedidoResumenResponse[]>(`${this.apiUrl}/estado/${estado}`);
  }

  /**
   * Crea un nuevo pedido (ej: Facturación manual / directo)
   */
  crearPedido(request: PedidoCreateRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  /**
   * Registra el pago de un pedido (cambia estado a FACTURADO)
   * Nota: Asume la existencia de un endpoint /facturar o /pagar
   */
  registrarPago(pedidoId: string, metodoPago: string): Observable<any> {
    // Si tu backend real tiene este endpoint, lo usas.
    // Ej: return this.http.patch<any>(`${this.apiUrl}/${pedidoId}/facturar`, { metodoPago });
    
    // Por ahora, para continuar con la UI, simulamos la respuesta HTTP si el endpoint aún no existe:
    return of({ success: true, pedidoId, metodoPago });
  }
}
