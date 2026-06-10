export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'POR_PAGAR' | 'INACTIVA';

export interface Mesa {
  id: string;        // UUID proveniente del backend
  nombre: string;
  capacidad: number;
  zona: string | null;
  estado: EstadoMesa;
  activo: boolean;
  observaciones?: string | null;
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
  observaciones?: string | null;
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

// --- Enums de Caja y Facturación ---
export type EstadoSesion = 'ABIERTA' | 'CERRADA';
export type EstadoFacturaRestaurante = 'PENDIENTE' | 'PAGADA' | 'ANULADA';
export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CORTESIA';

// --- Response DTOs de Caja ---
export interface SesionCajaResponse {
  id: string;
  cajeroId: string;
  estado: EstadoSesion;
  baseEfectivo: number;
  totalVentasEfectivo: number;
  totalVentasTarjeta: number;
  totalVentasTransferencia: number;
  efectivoReal: number;
  diferencia: number;
  fechaApertura: string;
  fechaCierre: string | null;
}

export interface FacturaResponse {
  id: string;
  numeroFactura: string;
  pedidoId: string;
  nombreMesa: string;
  sesionCajaId: string;
  cajeroId: string;
  subtotal: number;
  total: number;
  metodoPago: MetodoPago;
  estado: EstadoFacturaRestaurante;
  fechaEmision: string;
}

// --- Request DTOs de Caja ---
export interface AbrirSesionRequest {
  baseEfectivo: number;
}

export interface CerrarSesionRequest {
  efectivoReal: number;
}

export interface FacturarPedidoRequest {
  pedidoId: string;
  metodoPago: MetodoPago;
  propina: number;
}

/**
 * Espejo exacto de EstadoPedido.java
 * 7 valores — coincide con @Enumerated(EnumType.STRING) del backend.
 */
export type EstadoPedido =
  | 'BORRADOR'
  | 'ENVIADO_COCINA'
  | 'EN_PREPARACION'
  | 'LISTO_PARA_SERVIR'
  | 'ENTREGADO'
  | 'FACTURADO'
  | 'CANCELADO';

/** Espejo de PedidoResumenResponse.java */
export interface PedidoResumenResponse {
  id: string;                 // UUID
  nombreMesa: string;
  meseroId: string;           // UUID
  numeroComensales: number;
  estado: EstadoPedido;
  subtotal: number;           // BigDecimal → number (Jackson)
  fechaCreacion: string;      // LocalDateTime → ISO-8601 string
}

/** Espejo de DetallePedidoRequest.java */
export interface DetallePedidoRequest {
  productoId: string;         // @NotBlank
  nombreProducto: string;     // @NotBlank — congelado al momento del pedido
  cantidad: number;           // @Min(1)
  precioUnitario: number;     // BigDecimal — Jackson acepta number
  categoria: string;          // @NotBlank — 'COMIDA' | 'BEBIDA'
  observaciones?: string;
}

/** Espejo de DetallePedidoResponse.java */
export interface DetallePedidoResponse {
  id: string;                 // UUID
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;     // BigDecimal → number
  subtotalLinea: number;      // cantidad * precioUnitario (calculado por backend)
  observaciones?: string | null;
}

/**
 * Espejo de PedidoCreateRequest.java
 * mesaId es @NotNull en Java — NO puede ser opcional.
 * detalles es @NotEmpty — mínimo 1 DetallePedidoRequest.
 */
export interface PedidoCreateRequest {
  mesaId: string;             // UUID — obligatorio (@NotNull)
  numeroComensales: number;   // @Min(1) @Max(50)
  notas?: string;
  detalles: DetallePedidoRequest[];
}

/**
 * Espejo completo de PedidoResponse.java
 * Reemplaza la antigua interfaz 'Pedido' de pedido.model.ts que
 * tenía campos inventados (numero, destino, horaCreacion, items, total).
 */
export interface PedidoResponse {
  id: string;                         // UUID
  mesaId: string;                     // UUID
  nombreMesa: string;
  meseroId: string;                   // UUID
  numeroComensales: number;
  notas: string | null;
  estado: EstadoPedido;
  subtotal: number;                   // BigDecimal → number
  fechaCreacion: string;              // LocalDateTime → ISO-8601
  fechaCierre: string | null;         // null mientras esté abierto
  detalles: DetallePedidoResponse[];
}
