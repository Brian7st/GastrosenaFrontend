import { Pedido } from '@restaurant/shared/models';

export type EstadoMesa = 'libre' | 'ocupada' | 'por_pagar';

export interface Mesa {
  id: number;
  numero: number;
  asientos: number;
  estado: EstadoMesa;
  comensal?: string;
  cantidadComensales?: number;
  ordenActual?: Pedido | null;
  notas?: string;
  zona?: string;
  isActive?: boolean;
}

export interface RestauranteStats {
  totalMesas: number;
  mesasOcupadas: number;
  porcentajeOcupacion: number;
  pedidosPendientes: number;
}

export interface CajaStats {
  pedidosListos: number;
  mesasPorPagar: number;
  facturasHoy: number;
  totalFacturado: number;
}

export interface TurnoCaja {
  id: string;
  estado: 'ABIERTA' | 'CERRADA';
  baseInicial: number;
  responsable: string;
  fechaApertura: Date;
  fechaCierre?: Date;
  saldoFinal?: number;
}

export type EstadoPedidoBackend = 
  'BORRADOR' | 'ENVIADO_COCINA' | 'EN_PREPARACION' | 
  'LISTO_PARA_SERVIR' | 'ENTREGADO' | 'FACTURADO' | 'CANCELADO';

export interface PedidoResumenResponse {
  id: string; // UUID in backend
  nombreMesa: string;
  meseroId: string;
  numeroComensales: number;
  estado: EstadoPedidoBackend;
  subtotal: number;
  fechaCreacion: string; 
}

export interface DetallePedidoRequest {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  categoria: string;
  observaciones?: string;
}

export interface PedidoCreateRequest {
  mesaId?: string; // UUID from backend
  numeroComensales: number;
  notas?: string;
  detalles: DetallePedidoRequest[];
}
