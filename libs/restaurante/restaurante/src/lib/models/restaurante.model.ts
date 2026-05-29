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
