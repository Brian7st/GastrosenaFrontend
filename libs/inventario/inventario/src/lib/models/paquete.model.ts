// ── Paquete Probatorio — Modelo y Mock (F-10) ──────────────────────────────

export type PaqueteEstado =
  | 'INCOMPLETO'
  | 'COMPLETO'
  | 'ARCHIVADO';

export interface PaqueteProbatorio {
  id: string;
  expediente: string;                  // PKT-2026-015
  titulo: string;                      // "Insumos Cárnicos Semestre 1"
  fichaId: string;                     // era: ficha
  estado: PaqueteEstado;
  gilId: string;                       // era: gilVinculado
  cufeFuenteId?: string;               // era: cufe
  actaId?: string;                     // era: documentos[tipo='acta'].referencia
  requisicionId?: string;              // era: documentos[tipo='requisicion'].referencia
  registroAsistenciaAdjunto: boolean;  // era: documentos[tipo='asistencia'].vinculado
  instructorId: string;                // era: responsable
  fecha: string;                       // "15/04/2026"
}

// ── Mock Data ──────────────────────────────────────────────────────────────

export const MOCK_PAQUETES: PaqueteProbatorio[] = [
  {
    id: '1',
    expediente: 'PKT-2026-015',
    titulo: 'Insumos Cárnicos Semestre 1',
    fichaId: '2574832',
    estado: 'COMPLETO',
    gilId: 'GIL-88392-A',
    cufeFuenteId: 'a8f9c2e4b1d7f6a5',
    actaId: 'ACT-120',
    requisicionId: 'REQ-554',
    registroAsistenciaAdjunto: true,
    instructorId: 'Chef Sebastián',
    fecha: '15/04/2026',
  },
  {
    id: '2',
    expediente: 'PKT-2026-016',
    titulo: 'Materia Prima Lácteos',
    fichaId: '2574833',
    estado: 'INCOMPLETO',
    gilId: 'GIL-88393-B',
    cufeFuenteId: 'b7e3d1f0c2a8e4b9',
    actaId: 'ACT-121',
    requisicionId: 'REQ-555',
    registroAsistenciaAdjunto: false,
    instructorId: 'Laura Cortés',
    fecha: '18/04/2026',
  },
  {
    id: '3',
    expediente: 'PKT-2026-017',
    titulo: 'Dotación Vinos y Espirituosos',
    fichaId: '2574834',
    estado: 'INCOMPLETO',
    gilId: '--',
    registroAsistenciaAdjunto: false,
    instructorId: 'Chef Mario',
    fecha: '20/04/2026',
  },
  {
    id: '4',
    expediente: 'PKT-2026-018',
    titulo: 'Verduras de Estación',
    fichaId: '2574835',
    estado: 'INCOMPLETO',
    gilId: 'GIL-88395-C',
    cufeFuenteId: 'c4d6e8f1a3b5c7d9',
    actaId: 'ACT-123',
    requisicionId: 'REQ-557',
    registroAsistenciaAdjunto: true,
    instructorId: 'Andrés Muñoz',
    fecha: '22/04/2026',
  },
  {
    id: '5',
    expediente: 'PKT-2026-019',
    titulo: 'Utensilios de Pastelería',
    fichaId: '2574836',
    estado: 'COMPLETO',
    gilId: 'GIL-88396-D',
    cufeFuenteId: 'd5e7f9a2b4c6d8e0',
    actaId: 'ACT-124',
    requisicionId: 'REQ-558',
    registroAsistenciaAdjunto: true,
    instructorId: 'Rosa Vargas',
    fecha: '25/04/2026',
  },
  {
    id: '6',
    expediente: 'PKT-2026-020',
    titulo: 'Conservas y Enlatados',
    fichaId: '2574837',
    estado: 'ARCHIVADO',
    gilId: 'GIL-88397-E',
    cufeFuenteId: 'e6f8a0b1c3d5e7f9',
    actaId: 'ACT-125',
    requisicionId: 'REQ-559',
    registroAsistenciaAdjunto: true,
    instructorId: 'Chef Sebastián',
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
