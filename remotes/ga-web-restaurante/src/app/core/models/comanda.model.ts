export interface DetalleItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Comanda {
  idComanda: string;
  mesa: string;
  mesero: string;
  estado: 'En Preparación' | 'Abierto' | 'Pagado' | 'Cerrado';
  total: number;
  fechaHora: Date | string;
  items: number;
  detalles: DetalleItem[];
}
