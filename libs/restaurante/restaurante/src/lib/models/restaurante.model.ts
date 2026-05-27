export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'POR_PAGAR' | 'INACTIVA';

export interface Mesa {
  id: string;        // UUID proveniente del backend
  nombre: string;
  capacidad: number;
  zona: string | null;
  estado: EstadoMesa;
  activo: boolean;
}

/** Espejo de MesaCreateRequest.java — @NotBlank nombre, @NotNull capacidad */
export interface MesaCreateRequest {
  nombre: string;
  capacidad: number;
  zona?: string | null;
}

/** Espejo de MesaUpdateRequest.java — todos los campos son opcionales (PATCH parcial) */
export interface MesaUpdateRequest {
  nombre?: string;
  capacidad?: number;
  zona?: string | null;
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
