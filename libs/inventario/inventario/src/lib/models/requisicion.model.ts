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
  id:               string;
  numero:           string;
  programa:         string;
  fichaId:          string;
  instructorId:     string;
  instructorNombre: string;
  diaSemana:        string;
  horaSesion:       string;
  fecha:            string;
  estado:           RequisicionEstado;
  items:            RequisicionItem[];
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_REQUISICIONES: Requisicion[] = [
  {
    id: '1',
    numero: '0895',
    programa: 'Gastronomía',
    fichaId: '2574832',
    instructorId: 'usr-sebastián',
    instructorNombre: 'Chef Sebastián',
    diaSemana: 'Lunes',
    horaSesion: '08:00 - 12:00',
    fecha: '10/04/2026',
    estado: 'BORRADOR',
    items: [
      { codigo: 'INS-001', descripcion: 'Harina de Trigo', cantidad: 5, unidad: 'kg' },
      { codigo: 'INS-002', descripcion: 'Aceite de Oliva', cantidad: 2, unidad: 'L' },
    ],
  },
  {
    id: '2',
    numero: '0892',
    programa: 'Panadería',
    fichaId: '2574833',
    instructorId: 'usr-valentina',
    instructorNombre: 'Chef Valentina',
    diaSemana: 'Miércoles',
    horaSesion: '14:00 - 18:00',
    fecha: '08/04/2026',
    estado: 'ENVIADA',
    items: [
      { codigo: 'INS-003', descripcion: 'Mantequilla sin sal', cantidad: 3, unidad: 'kg' },
    ],
  },
  {
    id: '3',
    numero: '0890',
    programa: 'Pastelería',
    fichaId: '2574834',
    instructorId: 'usr-mario',
    instructorNombre: 'Chef Mario',
    diaSemana: 'Jueves',
    horaSesion: '07:00 - 11:00',
    fecha: '05/04/2026',
    estado: 'DESPACHADA',
    items: [
      { codigo: 'INS-004', descripcion: 'Azúcar Glass', cantidad: 4, unidad: 'kg' },
    ],
  },
  {
    id: '4',
    numero: '0888',
    programa: 'Sommelier',
    fichaId: '2574835',
    instructorId: 'usr-alejandro',
    instructorNombre: 'Chef Alejandro',
    diaSemana: 'Viernes',
    horaSesion: '10:00 - 14:00',
    fecha: '01/04/2026',
    estado: 'FIRMADA',
    items: [
      { codigo: 'INS-005', descripcion: 'Vino Tinto Selección', cantidad: 2, unidad: 'botella' },
    ],
  },
];
