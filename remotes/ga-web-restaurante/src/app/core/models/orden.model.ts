export type OrdenEstado = 'abierto' | 'en preparacion' | 'completado';

export interface OrdenItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Orden {
  id: string;
  mesa: string;
  cliente: string;
  estado: OrdenEstado;
  total: number;
  items?: OrdenItem[];
  hora?: string;
}