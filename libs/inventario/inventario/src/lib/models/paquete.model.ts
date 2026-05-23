// ── Paquete Probatorio — Modelo y Mock ──────────────────────────────────────

export type PaqueteEstado =
  | 'INCOMPLETO'
  | 'COMPLETO'
  | 'ARCHIVADO';

export interface DocumentoBase {
  tipo: 'acta' | 'requisicion' | 'asistencia';
  vinculado: boolean;
  referencia?: string; // e.g. "Acta Nº 120", "Req. Nº 554"
}

export interface PaqueteProbatorio {
  id: string;
  expediente: string;        // PKT-2026-015
  titulo: string;            // "Insumos Cárnicos Semestre 1"
  ficha: string;             // "2574832"
  programa: string;          // "Gastronomía"
  estado: PaqueteEstado;
  gilVinculado: string;      // "GIL-88392-A"
  cufe?: string;
  documentos: DocumentoBase[];
  responsable: string;
  responsableIniciales?: string;
  fecha: string;             // "15/04/2026"
}

// ── Mock Data ──────────────────────────────────────────────────────────────

export const MOCK_PAQUETES: PaqueteProbatorio[] = [
  {
    id: '1',
    expediente: 'PKT-2026-015',
    titulo: 'Insumos Cárnicos Semestre 1',
    ficha: '2574832',
    programa: 'Gastronomía',
    estado: 'COMPLETO',
    gilVinculado: 'GIL-88392-A',
    cufe: 'a8f9c2e4b1d7f6a5',
    documentos: [
      { tipo: 'acta', vinculado: true, referencia: 'Acta Nº 120' },
      { tipo: 'requisicion', vinculado: true, referencia: 'Req. Nº 554' },
      { tipo: 'asistencia', vinculado: true },
    ],
    responsable: 'Chef Sebastián',
    fecha: '15/04/2026',
  },
  {
    id: '2',
    expediente: 'PKT-2026-016',
    titulo: 'Materia Prima Lácteos',
    ficha: '2574833',
    programa: 'Panadería',
    estado: 'INCOMPLETO',
    gilVinculado: 'GIL-88393-B',
    cufe: 'b7e3d1f0c2a8e4b9',
    documentos: [
      { tipo: 'acta', vinculado: true, referencia: 'Acta Nº 121' },
      { tipo: 'requisicion', vinculado: true, referencia: 'Req. Nº 555' },
      { tipo: 'asistencia', vinculado: false },
    ],
    responsable: 'Laura Cortés',
    responsableIniciales: 'LC',
    fecha: '18/04/2026',
  },
  {
    id: '3',
    expediente: 'PKT-2026-017',
    titulo: 'Dotación Vinos y Espirituosos',
    ficha: '2574834',
    programa: 'Sommelier',
    estado: 'INCOMPLETO',
    gilVinculado: '--',
    documentos: [
      { tipo: 'acta', vinculado: false },
      { tipo: 'requisicion', vinculado: false },
      { tipo: 'asistencia', vinculado: false },
    ],
    responsable: 'Chef Mario',
    fecha: '20/04/2026',
  },
  {
    id: '4',
    expediente: 'PKT-2026-018',
    titulo: 'Verduras de Estación',
    ficha: '2574835',
    programa: 'Gastronomía',
    estado: 'INCOMPLETO',
    gilVinculado: 'GIL-88395-C',
    cufe: 'c4d6e8f1a3b5c7d9',
    documentos: [
      { tipo: 'acta', vinculado: true, referencia: 'Acta Nº 123' },
      { tipo: 'requisicion', vinculado: true, referencia: 'Req. Nº 557' },
      { tipo: 'asistencia', vinculado: true },
    ],
    responsable: 'Andrés Muñoz',
    responsableIniciales: 'AM',
    fecha: '22/04/2026',
  },
  {
    id: '5',
    expediente: 'PKT-2026-019',
    titulo: 'Utensilios de Pastelería',
    ficha: '2574836',
    programa: 'Pastelería',
    estado: 'COMPLETO',
    gilVinculado: 'GIL-88396-D',
    cufe: 'd5e7f9a2b4c6d8e0',
    documentos: [
      { tipo: 'acta', vinculado: true, referencia: 'Acta Nº 124' },
      { tipo: 'requisicion', vinculado: true, referencia: 'Req. Nº 558' },
      { tipo: 'asistencia', vinculado: true },
    ],
    responsable: 'Rosa Vargas',
    responsableIniciales: 'RV',
    fecha: '25/04/2026',
  },
  {
    id: '6',
    expediente: 'PKT-2026-020',
    titulo: 'Conservas y Enlatados',
    ficha: '2574837',
    programa: 'Gastronomía',
    estado: 'ARCHIVADO',
    gilVinculado: 'GIL-88397-E',
    cufe: 'e6f8a0b1c3d5e7f9',
    documentos: [
      { tipo: 'acta', vinculado: true, referencia: 'Acta Nº 125' },
      { tipo: 'requisicion', vinculado: true, referencia: 'Req. Nº 559' },
      { tipo: 'asistencia', vinculado: true },
    ],
    responsable: 'Chef Sebastián',
    fecha: '28/04/2026',
  },
];

export interface TimelineEntry {
  estado: string;
  fecha: string;
  activo: boolean;
  tipo: 'success' | 'error' | 'neutral';
  detalle?: string;
}
