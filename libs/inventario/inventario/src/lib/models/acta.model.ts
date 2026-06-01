/**
 * Modelo de datos para el módulo de Actas de Legalización.
 * RF-5.10 — Legalización de materiales de formación por sesión.
 */

export type ActaEstado = 'BORRADOR' | 'PENDIENTE_FIRMAS' | 'FIRMADA' | 'REVISADA' | 'ARCHIVADA';

export interface AsistenteActa {
  nombre:         string;
  dependenciaRol: string;
  aprueba:        boolean;
}

export interface CompromisoActa {
  actividad:    string;
  responsable:  string;
  fechaLimite:  string;
}

export interface ActaLegalizacion {
  id:                    string;
  numeroActa:            string;
  comite?:               string;
  ciudad?:               string;
  fecha:                 string;
  horaInicio?:           string;
  horaFin?:              string;
  lugar?:                string;
  regional?:             string;
  programa:              string;
  fichaId:               string;
  instructorId:          string;
  requisicionId:         string;
  estado:                ActaEstado;
  resultadoAprendizaje?: string;
  actividadesRealizadas?: string;
  asistentes?:           AsistenteActa[];
  compromisos?:          CompromisoActa[];
  /** @deprecated Usar actividadesRealizadas */
  actividadesEjecutadas?: string;
  agendaSesion?:         string;
  desarrolloSesion?:     string;
}

export interface InsumoActa {
  codigo: string;
  descripcion: string;
  cantidad: number;
  costoUnitario: number;
}

export interface CompromisoActa {
  actividad: string;
  responsable: string;
  fechaLimite: string;
}

export interface FirmanteActa {
  nombre: string;
  cargo: string;
  firmado: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
export const MOCK_ACTAS: ActaLegalizacion[] = [
  {
    id: '1',
    numeroActa: 'Acta #0120',
    fecha: '12 Oct 2023',
    programa: 'Cocina Básica',
    fichaId: '24501A',
    instructorId: 'Chef Sebastián',
    requisicionId: '45-S',
    estado: 'BORRADOR',
    ciudad: 'Armenia',
    lugar: 'Escuela de Gastronomía',
    agendaSesion: 'Legalizar la entrega y consumo de materiales correspondientes al taller de cocina programado.',
    desarrolloSesion: 'Elaboración de Salsas Madre (Bechamel, Velouté, Española, Tomate, Holandesa).',
    resultadoAprendizaje: 'Preparar alimentos de acuerdo con el recetario estándar y solicitud del cliente.',
    actividadesEjecutadas: 'Elaboración de Salsas Madre (Bechamel, Velouté, Española, Tomate, Holandesa).',
  },
  {
    id: '2',
    numeroActa: 'Acta #0121',
    fecha: '14 Oct 2023',
    programa: 'Panadería Artesanal',
    fichaId: '24502B',
    instructorId: 'Chef Valentina',
    requisicionId: '46-P',
    estado: 'PENDIENTE_FIRMAS',
    ciudad: 'Armenia',
    lugar: 'Escuela de Gastronomía',
    agendaSesion: 'Legalizar entrega de materiales para clase de panadería artesanal.',
    desarrolloSesion: 'Elaboración de pan francés, ciabatta y baguette con técnicas de fermentación lenta.',
    resultadoAprendizaje: 'Aplicar técnicas de panificación según estándares de calidad.',
    actividadesEjecutadas: 'Elaboración de pan francés, ciabatta y baguette.',
  },
  {
    id: '3',
    numeroActa: 'Acta #0122',
    fecha: '15 Oct 2023',
    programa: 'Taller de Salsas Madre',
    fichaId: '24503C',
    instructorId: 'Chef Sebastián',
    requisicionId: '48-S',
    estado: 'FIRMADA',
    ciudad: 'Armenia',
    lugar: 'Escuela de Gastronomía',
    agendaSesion: 'Legalizar materiales utilizados en sesión de salsas madre.',
    desarrolloSesion: 'Preparación de las cinco salsas madre de la cocina francesa.',
    resultadoAprendizaje: 'Elaborar salsas madre aplicando técnicas de reducción y emulsión.',
    actividadesEjecutadas: 'Preparación de las cinco salsas madre de la cocina francesa.',
  },
  {
    id: '4',
    numeroActa: 'Acta #0123',
    fecha: '18 Oct 2023',
    programa: 'Cocina Internacional',
    fichaId: '24504D',
    instructorId: 'Chef Alejandro',
    requisicionId: '50-I',
    estado: 'REVISADA',
    ciudad: 'Armenia',
    lugar: 'Escuela de Gastronomía',
    agendaSesion: 'Legalizar materiales consumidos en clase de cocina internacional.',
    desarrolloSesion: 'Preparación de platos típicos de la gastronomía asiática y mediterránea.',
    resultadoAprendizaje: 'Preparar platos internacionales respetando técnicas y presentaciones.',
    actividadesEjecutadas: 'Preparación de platos típicos de la gastronomía asiática y mediterránea.',
  },
  {
    id: '5',
    numeroActa: 'Acta #0124',
    fecha: '20 Oct 2023',
    programa: 'Repostería Fina',
    fichaId: '24505E',
    instructorId: 'Chef Valentina',
    requisicionId: '52-R',
    estado: 'ARCHIVADA',
    ciudad: 'Armenia',
    lugar: 'Escuela de Gastronomía',
    agendaSesion: 'Legalizar insumos utilizados en taller de repostería fina.',
    desarrolloSesion: 'Elaboración de petit fours, macarons y mousse de chocolate.',
    resultadoAprendizaje: 'Elaborar productos de repostería fina con técnicas avanzadas.',
    actividadesEjecutadas: 'Elaboración de petit fours, macarons y mousse de chocolate.',
  },
];

export const MOCK_INSUMOS: InsumoActa[] = [
  { codigo: 'INS-00124', descripcion: 'Harina de Trigo (Saco 25kg)', cantidad: 0.5, costoUnitario: 45000 },
  { codigo: 'INS-00582', descripcion: 'Aceite de Oliva Extra Virgen (1L)', cantidad: 2, costoUnitario: 32500 },
  { codigo: 'INS-00911', descripcion: 'Mantequilla sin sal (Bloque 500g)', cantidad: 4, costoUnitario: 18200 },
  { codigo: 'INS-00344', descripcion: 'Leche Entera (Caja 12L)', cantidad: 1, costoUnitario: 48000 },
];

export const MOCK_COMPROMISOS: CompromisoActa[] = [
  { actividad: 'Cargue de evidencia fotográfica en plataforma Sofia Plus', responsable: 'Vocero Aprendices', fechaLimite: '21/04/2026' },
  { actividad: 'Registro de consumo en sistema de Gestión de Bienes', responsable: 'Chef Sebastián B.', fechaLimite: '20/04/2026' },
];

export const MOCK_FIRMANTES: FirmanteActa[] = [
  { nombre: 'Sebastián Betancourt', cargo: 'Instructor Cuentadante', firmado: false },
  { nombre: 'Camila Rodríguez M.', cargo: 'Vocero de Aprendices (Recepción y Conformidad)', firmado: false },
];

export interface WizardStep {
  number: number;
  label: string;
}
