import { EstadoPedido } from '@restaurant/shared/models';
export { EstadoPedido };

export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'POR_PAGAR' | 'INACTIVA';

// --- Enums de Detalles e Incidencias (Reglas de Cancelación/Devolución) ---
export type EstadoDetallePedido = 
  | 'PENDIENTE' 
  | 'PREPARANDO' 
  | 'TERMINADO' 
  | 'EN_DEVOLUCION' 
  | 'ENTREGADO' 
  | 'CANCELADO' 
  | 'DEVUELTO';

export type TipoIncidencia = 'CANCELACION' | 'DEVOLUCION';
export type EstadoIncidencia = 'EN_PROCESO' | 'RESUELTA';

export interface IncidenciaPedidoResponse {
  id: string;
  tipo: TipoIncidencia;
  detalleId: string | null;
  producto: string | null;
  cantidadAfectada: number | null;
  motivo: string;
  estado: EstadoIncidencia;
  registradaPor: string;
  fechaRegistro: string;
  fechaResolucion: string | null;
}

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
  estadoDetalle?: EstadoDetallePedido;
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
  incidencias?: IncidenciaPedidoResponse[];
}

// --- DTOs provenientes de Cocina (Recetas) ---

export interface RecetaIngredienteResponseDTO {
  idIngrediente: string;
  nombreIngrediente: string;
  cantidad: number;
  unidadMedida: string;
}

export interface PasosPreparacionResponseDTO {
  numeroPaso: number;
  descripcion: string;
}

export interface RecetaResponseDTO {
  idReceta: string;
  nombreReceta: string;
  nombreCategoria: string;
  idCategoria: string;
  fechaCreacion: string;
  tiempoPreparacion: number;
  precioUnitario: number;
  temperatura: string;
  urlImagen: string;
  activo: boolean;
  ingredientes?: RecetaIngredienteResponseDTO[];
  pasos?: PasosPreparacionResponseDTO[];
}
