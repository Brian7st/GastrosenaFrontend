export enum EstadoPedido {
  ESPERA = 'ESPERA',
  PREPARACION = 'PREPARACION',
  LISTO = 'LISTO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export interface PedidoItem {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnit: number;
  observacion?: string;
}

export interface Pedido {
  id: string;
  numero: number;
  mesaId: string;
  meseroId: string;
  estado: EstadoPedido;
  destino: 'COCINA' | 'BAR';
  horaCreacion: Date;
  items: PedidoItem[];
  total: number;
}
