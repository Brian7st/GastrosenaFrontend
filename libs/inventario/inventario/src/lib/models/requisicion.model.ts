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

/** Categorías de insumo — enum Swagger (B-04) */
export type CategoriaInsumo =
  | 'ABARROTES'
  | 'LACTEOS'
  | 'FRUTAS_Y_VEGETALES'
  | 'CARNES_PESCADOS_MARISCOS';

/** Ítem de requisición — Swagger actualizado (B-02).
 *  productoId = codigoSena del catálogo; usar como productoId en RegistrarSalidaHttpRequest. */
export interface RequisicionItem {
  productoId:     string;
  productoNombre: string;
  cantidad:       number;
  unidadMedida:   string;
  categoria:      CategoriaInsumo;
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
  /** Documento/ID del vocero que firmó la recepción (vacío si aún no firmada). */
  voceroId:         string;
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
    voceroId: '',
    items: [
      { productoId: 'SENA-INS-001', productoNombre: 'Harina de Trigo', cantidad: 5, unidadMedida: 'kg', categoria: 'ABARROTES' },
      { productoId: 'SENA-INS-002', productoNombre: 'Aceite de Oliva', cantidad: 2, unidadMedida: 'L', categoria: 'ABARROTES' },
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
    voceroId: '',
    items: [
      { productoId: 'SENA-INS-003', productoNombre: 'Mantequilla sin sal', cantidad: 3, unidadMedida: 'kg', categoria: 'LACTEOS' },
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
    voceroId: '',
    items: [
      { productoId: 'SENA-INS-004', productoNombre: 'Azúcar Glass', cantidad: 4, unidadMedida: 'kg', categoria: 'ABARROTES' },
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
    voceroId: 'CC 1094-vocero',
    items: [
      { productoId: 'SENA-INS-005', productoNombre: 'Vino Tinto Selección', cantidad: 2, unidadMedida: 'botella', categoria: 'ABARROTES' },
    ],
  },
];
