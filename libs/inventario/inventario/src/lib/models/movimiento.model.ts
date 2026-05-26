// ── Movimiento de Almacén — Modelo (F-11) ──────────────────────────────────

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

/** Payload del formulario de registro de entrada */
export interface EntradaMovimientoData {
  producto: string;
  cantidad: number;
  fecha: string;
  proveedor: string;
  factura?: string;
  ubicacion: string;
  valorUnitario: number;
  observaciones?: string;
}

/** Payload del formulario de registro de salida */
export interface SalidaMovimientoData {
  producto: string;
  cantidad: number;
  fecha: string;
  areaDestino: string;
  instructor?: string;
  ficha?: string;
  categoria: string;
  proposito: string;
  observaciones?: string;
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
