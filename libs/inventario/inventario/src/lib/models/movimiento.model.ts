// ── Movimiento de Almacén — Modelo (F-11) ──────────────────────────────────

/** Documento agrupado de movimientos (lista de entradas/salidas). */
export interface DocumentoMovimiento {
  tipo: 'ENTRADA' | 'SALIDA';
  documentoId: string;
  numeroDocumento: string;
  cantidadBienes: number;
  cantidadTotal: number;
  valorTotal: number;
  fecha: string;
  estado: 'Completado' | 'Pendiente' | 'Cancelado';
}

export interface Movimiento {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'RESERVA' | 'LIBERACION' | 'AJUSTE';
  productoNombre: string;
  codigoSena: string;
  cantidad: number;
  unidadMedida: string;    // era: unidad
  fechaMovimiento: string; // ISO datetime — e.g. "2023-10-15T09:45:00Z"
  responsableNombre: string;
  valor: number;
  estado: 'Completado' | 'Pendiente' | 'Cancelado';
}

/** Payload del formulario de registro de entrada.
 *  Alineado con RegistrarEntradaHttpRequest (Swagger).
 *  Las entradas deben originarse desde un GIL validado → gilId obligatorio en ese flujo. */
export interface EntradaMovimientoData {
  productoId:      string;
  cantidad:        number;
  precioUnitario:  number;
  facturaId?:      string;
  proveedorNit?:   string;
  gilId?:          string;
  conciliacionId?: string;
}

/** Payload del formulario de registro de salida.
 *  Alineado con RegistrarSalidaHttpRequest (Swagger).
 *  Las salidas DEBEN referenciar una requisición válida → requisicionId obligatorio. */
export interface SalidaMovimientoData {
  productoId:    string;
  cantidad:      number;
  requisicionId: string;
  instructorId:  string;
  categoria:     string;
}

/** Payload para reservar stock de un producto */
export interface ReservaMovimientoData {
  producto: string;
  cantidad: number;
  fichaId: string;
  instructorId: string;
  observaciones?: string;
}

/** Payload para liberar una reserva existente */
export interface LiberacionMovimientoData {
  producto: string;
  cantidad: number;
  motivo: string;
}

/** Payload para ajustar el inventario físico de un producto */
export interface AjusteMovimientoData {
  producto: string;
  cantidadNueva: number;
  motivo: string;
  responsableId: string;
}
