export type EstadoConsolidado = 'Borrador' | 'Generado' | 'Contabilizado' | 'Reversado';
export type ConsolidadoVariant = 'success' | 'warning' | 'danger' | 'info';

export interface Consolidado {
  id: string;
  mes: string;
  tipo: string;
  total: string;
  estado: EstadoConsolidado | string;
  variant: ConsolidadoVariant | string;
}

export type GilEstado = 'Disponible' | 'En otro consolidado';

export interface GilItem {
  id: string;
  codigo: string;
  instructor: string;
  programa: string;
  ficha: string;
  fecha: string;
  valor: number;
  estado: GilEstado | string;
  consolidadoRef?: string;
  selected: boolean;
}

export const ConsolidadoMock: Consolidado[] = [
  { id: 'CON-2023-12-01', mes: 'Diciembre 2023', tipo: 'Cierre Anual', total: '$45,200,000.00', estado: 'Contabilizado', variant: 'success' },
  { id: 'CON-2023-11-28', mes: 'Noviembre 2023', tipo: 'Regular', total: '$38,150,000.00', estado: 'Generado', variant: 'info' },
  { id: 'CON-2023-10-15', mes: 'Octubre 2023', tipo: 'Regular', total: '$29,400,000.00', estado: 'Borrador', variant: 'warning' },
  { id: 'CON-2023-09-30', mes: 'Septiembre 2023', tipo: 'Regular', total: '$41,200,000.00', estado: 'Contabilizado', variant: 'success' }
];

export const GIL_ITEMS_MOCK: GilItem[] = [
  { id: '1', codigo: 'GIL-2024-012', instructor: 'Ricardo Martínez', programa: 'Cocina', ficha: '2541010', fecha: '15/04/2024', valor: 844900, estado: 'Disponible', selected: true },
  { id: '2', codigo: 'GIL-2024-015', instructor: 'Ana Lucia Gómez', programa: 'Repostería', ficha: '2541022', fecha: '16/04/2024', valor: 1200000, estado: 'Disponible', selected: true },
  { id: '3', codigo: 'GIL-2023-998', instructor: 'Julián Prada', programa: 'Sistemas', ficha: '2541030', fecha: '10/01/2024', valor: 540000, estado: 'En otro consolidado', consolidadoRef: '#CON-2024-001', selected: false },
];
