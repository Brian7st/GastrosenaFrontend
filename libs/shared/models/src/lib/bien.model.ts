export type EstadoStock = 'DISPONIBLE' | 'BAJO_STOCK' | 'AGOTADO';

export interface Bien {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  estadoStock: EstadoStock;
}
