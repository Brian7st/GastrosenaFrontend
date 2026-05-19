import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PedidoResumenResponse, EstadoPedidoBackend, PedidoCreateRequest } from '../models/restaurante.model';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private http = inject(HttpClient);
  // URL base adaptada al api/pedidos. 
  // Podrías necesitar inyectar un token de environment.
  private apiUrl = '/api/pedidos'; 

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
