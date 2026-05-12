import { Pedido } from '@restaurant/shared/models';

export type EstadoMesa = 'libre' | 'ocupada' | 'por_pagar';

export interface Mesa {
  id: number;
  numero: number;
  asientos: number;
  estado: EstadoMesa;
  comensal?: string;
  ordenActual?: Pedido | null;
  notas?: string;
}

export interface RestauranteStats {
  totalMesas: number;
  mesasOcupadas: number;
  porcentajeOcupacion: number;
  pedidosPendientes: number;
}

