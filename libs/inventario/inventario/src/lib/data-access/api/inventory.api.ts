export interface ExistenciaResponse {
  productoId: string;
  stockFisico: number;
  stockReservado: number;
  stockDisponible: number;
  stockMinimo: number;
  bajoMinimo: boolean;
}

export interface MovimientoResponse {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'RESERVA' | 'LIBERACION' | 'AJUSTE';
  productoId: string;
  productoNombre: string;
  codigoSena: string;
  cantidad: number;
  unidadMedida: string;
  fechaMovimiento: string;
  responsableId: string;
  responsableNombre: string;
  valor: number;
  estado: 'Completado' | 'Pendiente' | 'Cancelado';
}

export interface EntradaRequest {
  productoId: string;
  cantidad: number;
  fecha: string;
  proveedorId?: string;
  facturaId?: string;
  ubicacion: string;
  valorUnitario: number;
  observaciones?: string;
}

export interface SalidaRequest {
  productoId: string;
  cantidad: number;
  fecha: string;
  areaDestino: string;
  instructorId?: string;
  fichaId?: string;
  categoria: string;
  proposito: string;
  observaciones?: string;
}

export interface ReservaRequest {
  productoId: string;
  cantidad: number;
  fichaId: string;
  instructorId: string;
  observaciones?: string;
}

export interface LiberacionRequest {
  productoId: string;
  cantidad: number;
  motivo: string;
}

export interface AjusteRequest {
  productoId: string;
  cantidadNueva: number;
  motivo: string;
  responsableId: string;
}
