/**
 * Modelo de datos para Requisiciones Internas (Formato 45-S).
 * RF-5.8 — Gestión de requisiciones de materiales por sesión de formación.
 */

export type RequisicionEstado =
  | 'BORRADOR'
  | 'ENVIADA'
  | 'DESPACHADA'
  | 'FIRMADA'
  | 'LEGALIZADA';

export interface RequisicionItem {
  codigo:      string;
  descripcion: string;
  cantidad:    number;
  unidad:      string;
}

export interface Requisicion {
  id:         string;
  codigo:     string;
  programa:   string;
  ficha:      string;
  instructor: string;
  fecha:      string;
  estado:     RequisicionEstado;
  items:      RequisicionItem[];
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_REQUISICIONES: Requisicion[] = [
  {
    id: '1',
    codigo: '0895',
    programa: 'Gastronomía',
    ficha: '2574832',
    instructor: 'Chef Sebastián',
    fecha: '10/04/2026',
    estado: 'BORRADOR',
    items: [
      { codigo: 'INS-001', descripcion: 'Harina de Trigo', cantidad: 5, unidad: 'kg' },
      { codigo: 'INS-002', descripcion: 'Aceite de Oliva', cantidad: 2, unidad: 'L' },
    ],
  },
  {
    id: '2',
    codigo: '0892',
    programa: 'Panadería',
    ficha: '2574833',
    instructor: 'Chef Valentina',
    fecha: '08/04/2026',
    estado: 'ENVIADA',
    items: [
      { codigo: 'INS-003', descripcion: 'Mantequilla sin sal', cantidad: 3, unidad: 'kg' },
    ],
  },
  {
    id: '3',
    codigo: '0890',
    programa: 'Pastelería',
    ficha: '2574834',
    instructor: 'Chef Mario',
    fecha: '05/04/2026',
    estado: 'DESPACHADA',
    items: [
      { codigo: 'INS-004', descripcion: 'Azúcar Glass', cantidad: 4, unidad: 'kg' },
    ],
  },
  {
    id: '4',
    codigo: '0888',
    programa: 'Sommelier',
    ficha: '2574835',
    instructor: 'Chef Alejandro',
    fecha: '01/04/2026',
    estado: 'FIRMADA',
    items: [
      { codigo: 'INS-005', descripcion: 'Vino Tinto Selección', cantidad: 2, unidad: 'botella' },
    ],
  },
];
