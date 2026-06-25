export enum EstadoPedido {
  BORRADOR = 'BORRADOR',
  ENVIADO_COCINA = 'ENVIADO_COCINA',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO_PARA_SERVIR = 'LISTO_PARA_SERVIR',
  ENTREGADO = 'ENTREGADO',
  FACTURADO = 'FACTURADO',
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
