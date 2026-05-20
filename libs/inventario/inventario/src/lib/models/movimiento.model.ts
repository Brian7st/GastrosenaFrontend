export interface Movimiento {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA';
  productoNombre: string;
  productoSku: string;
  codigoSena: string;
  cantidad: number;
  unidad: string;
  fecha: string;
  hora: string;
  origenDestino: string;
  docOrigen: string;
  docUrl?: string;
  responsableNombre: string;
  responsableAvatar: string;
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
