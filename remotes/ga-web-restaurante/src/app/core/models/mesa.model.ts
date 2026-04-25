export type MesaEstado = 'Libre' | 'Ocupado' | 'Espera';

export interface Mesa {
  id: number;
  nombre: string;
  asientos: number;
  estado: MesaEstado;
  cliente?: string;
  tiempoOcupada?: string;
}