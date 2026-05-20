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
