// ============================================================
// Consolidado de Ejecución Presupuestal — Modelos (F-09)
// ============================================================

export type EstadoConsolidado = 'GENERADO' | 'CONTABILIZADO' | 'REVERSADO';

export interface LineaConsolidado {
  id:          string;
  tipo:        string;
  referencia:  string;
  descripcion: string;
  cantidad:    number;
  valor:       number;
}

export interface TotalesConsolidado {
  totalBienes:    number;
  totalServicios: number;
  totalGeneral:   number;
}

export interface Consolidado {
  id:               string;
  numero:           number;
  fechaGeneracion:  string;
  generadoPor:      string;
  estado:           EstadoConsolidado;
  lineas:           LineaConsolidado[];
  totales:          TotalesConsolidado;
}

// ── Variante de badge derivada en componente ──────────────────────────────
// GENERADO → 'info' | CONTABILIZADO → 'success' | REVERSADO → 'danger'

export type GilEstado = 'Disponible' | 'En otro consolidado';

export interface GilItem {
  id:              string;
  codigo:          string;
  instructor:      string;
  programa:        string;
  ficha:           string;
  fecha:           string;
  valor:           number;
  estado:          GilEstado | string;
  consolidadoRef?: string;
  selected:        boolean;
}

// ============================================================
// MOCKS
// ============================================================

export const MOCK_CONSOLIDADOS: Consolidado[] = [
  {
    id:              'CON-2023-12-01',
    numero:          1,
    fechaGeneracion: '2023-12-01',
    generadoPor:     'admin@sena.edu.co',
    estado:          'CONTABILIZADO',
    lineas: [
      { id: 'L-001', tipo: 'BIEN',     referencia: 'GIL-2023-045', descripcion: 'Materiales de Cocina',    cantidad: 10, valor: 15200000 },
      { id: 'L-002', tipo: 'SERVICIO', referencia: 'GIL-2023-046', descripcion: 'Servicio de Transporte', cantidad: 1,  valor: 3000000  },
      { id: 'L-003', tipo: 'BIEN',     referencia: 'GIL-2023-047', descripcion: 'Equipos de Repostería',  cantidad: 3,  valor: 27000000 },
    ],
    totales: { totalBienes: 42200000, totalServicios: 3000000, totalGeneral: 45200000 },
  },
  {
    id:              'CON-2023-11-28',
    numero:          2,
    fechaGeneracion: '2023-11-28',
    generadoPor:     'admin@sena.edu.co',
    estado:          'GENERADO',
    lineas: [
      { id: 'L-004', tipo: 'BIEN',     referencia: 'GIL-2023-038', descripcion: 'Insumos de Panadería',   cantidad: 20, valor: 22000000 },
      { id: 'L-005', tipo: 'BIEN',     referencia: 'GIL-2023-039', descripcion: 'Uniformes de Cocina',   cantidad: 15, valor: 16150000 },
    ],
    totales: { totalBienes: 38150000, totalServicios: 0, totalGeneral: 38150000 },
  },
  {
    id:              'CON-2023-10-15',
    numero:          3,
    fechaGeneracion: '2023-10-15',
    generadoPor:     'supervisor@sena.edu.co',
    estado:          'GENERADO',
    lineas: [
      { id: 'L-006', tipo: 'BIEN',     referencia: 'GIL-2023-030', descripcion: 'Cuchillería Profesional', cantidad: 8, valor: 12000000 },
      { id: 'L-007', tipo: 'SERVICIO', referencia: 'GIL-2023-031', descripcion: 'Mantenimiento Equipos',  cantidad: 1, valor: 5400000  },
      { id: 'L-008', tipo: 'BIEN',     referencia: 'GIL-2023-032', descripcion: 'Menaje de Cocina',       cantidad: 5, valor: 12000000 },
    ],
    totales: { totalBienes: 24000000, totalServicios: 5400000, totalGeneral: 29400000 },
  },
  {
    id:              'CON-2023-09-30',
    numero:          4,
    fechaGeneracion: '2023-09-30',
    generadoPor:     'admin@sena.edu.co',
    estado:          'CONTABILIZADO',
    lineas: [
      { id: 'L-009', tipo: 'BIEN',     referencia: 'GIL-2023-020', descripcion: 'Vajilla Institucional',   cantidad: 12, valor: 20500000 },
      { id: 'L-010', tipo: 'BIEN',     referencia: 'GIL-2023-021', descripcion: 'Lencería de Cocina',     cantidad: 30, valor: 9700000  },
      { id: 'L-011', tipo: 'SERVICIO', referencia: 'GIL-2023-022', descripcion: 'Servicio de Limpieza',   cantidad: 2,  valor: 11000000 },
    ],
    totales: { totalBienes: 30200000, totalServicios: 11000000, totalGeneral: 41200000 },
  },
];

export const GIL_ITEMS_MOCK: GilItem[] = [
  { id: '1', codigo: 'GIL-2024-012', instructor: 'Ricardo Martínez', programa: 'Cocina',      ficha: '2541010', fecha: '15/04/2024', valor: 844900,  estado: 'Disponible',         selected: true  },
  { id: '2', codigo: 'GIL-2024-015', instructor: 'Ana Lucia Gómez',  programa: 'Repostería',  ficha: '2541022', fecha: '16/04/2024', valor: 1200000, estado: 'Disponible',         selected: true  },
  { id: '3', codigo: 'GIL-2023-998', instructor: 'Julián Prada',     programa: 'Sistemas',    ficha: '2541030', fecha: '10/01/2024', valor: 540000,  estado: 'En otro consolidado', consolidadoRef: '#CON-2024-001', selected: false },
];
