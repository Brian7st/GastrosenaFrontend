// ============================================================
// Presupuesto General — Modelos e interfaces (F-08)
// RF-5.7.1 → RF-5.7.9, RF6.1.11
// ============================================================

export type TipoAfectacion = 'Compromiso' | 'Pago' | 'Traslado' | 'Anulación';
export type UrgenciaVencimiento = 'critico' | 'proximo' | 'normal';

export interface Rubro {
  id: string;
  codigo: string;
  descripcion: string;       // era: nombre
  fichaId: string;           // era: programaId
  programaFormacion: string; // nuevo — nombre del programa
  montoAsignado: number;     // era: apropiacionInicial
  saldoDisponible: number;   // era: disponible
  montoComprometido: number; // era: comprometido
  montoPagado: number;       // era: pagado
  retencionZese: number;
  porcentajeEjecucion: number;
}

/** Vista agrupada calculada en cliente — no viene del API */
export interface GrupoPresupuestal {
  fichaId: string;
  programaFormacion: string;
  rubros: Rubro[];
  totalMontoAsignado: number;
  totalSaldoDisponible: number;
  totalMontoComprometido: number;
  totalMontoPagado: number;
  totalZese: number;
  porcentajeEjecucion: number;
}

export interface PresupuestoResumen {
  vigenciaFiscal: number;
  corte: string;
  totalApropiacion: number;
  totalComprometido: number;
  totalPagado: number;
  totalDisponible: number;
  totalZese: number;
  porcentajeEjecucion: number;
  variacionAnual: number;
}

export interface AfectacionPresupuestal {
  id: string;
  fecha: string;
  tipo: TipoAfectacion;
  documentoId: string;
  documentoTipo: 'GIL' | 'FEL';
  programa: string;
  rubro: string;
  valor: number;
  saldoResultante: number;
}

export interface VencimientoProximo {
  id: string;
  titulo: string;
  diasRestantes: number;
  fechaVencimiento: string;
  icono: string;
  urgencia: UrgenciaVencimiento;
}

export interface EjecucionMensual {
  mes: string;
  valor: number;
  porcentaje: number;
  esMesActual: boolean;
}

/** Payload para registrar un nuevo rubro presupuestal */
export interface RegistrarPresupuestoData {
  programaId: string;
  vigenciaFiscal: number;
  nombreRubro: string;
  codigoPresupuestal: string;
  bolsaInicial: number;
}

/** Payload para trasladar saldo entre rubros */
export interface TrasladarRubroData {
  rubroOrigenId: string;
  rubroDestinoId: string;
  valor: number;
  motivo?: string;
}

// ── Compromisos presupuestales ────────────────────────────────────────────────

/** Compromiso presupuestal (GET /budget/compromisos) */
export interface Compromiso {
  id: string;
  presupuestoId: string;
  rubroId: string;
  gilId?: string;
  concepto: string;
  monto: number;
  montoRetencionZese: number;
  fecha: string;
  estado: 'VIGENTE' | 'ANULADO';
}

/** Payload UI para comprometer presupuesto (POST /budget/compromisos) */
export interface ComprometerData {
  presupuestoId: string;
  rubroId: string;
  gilId?: string;
  facturaId?: string;
  fichaId: string;
  programaId: string;
  concepto: string;
  monto: number;
  aplicarZESE: boolean;
  fecha: string;
}

/** Payload UI para registrar pago (POST /budget/compromisos/{id}/pagos) */
export interface PagoData {
  cufeFuenteId: string;
  monto: number;
  fecha: string;
}

// ============================================================
// MOCKS
// ============================================================

export const MOCK_RESUMEN: PresupuestoResumen = {
  vigenciaFiscal: 2024,
  corte: '30 de Octubre',
  totalApropiacion: 2450000000,
  totalComprometido: 1240000000,
  totalPagado: 892000000,
  totalDisponible: 1210000000,
  totalZese: 15625000,
  porcentajeEjecucion: 50.6,
  variacionAnual: 5.2,
};

export const MOCK_RUBROS: Rubro[] = [
  {
    id: 'RUB-001',
    codigo: '212-04-01-01',
    descripcion: 'Materiales para Formación',
    fichaId: 'PRG-001',
    programaFormacion: 'Formación Profesional Integral',
    montoAsignado: 450000000,
    saldoDisponible: 180000000,
    montoComprometido: 170000000,
    montoPagado: 100000000,
    retencionZese: 2500000,
    porcentajeEjecucion: 60.0,
  },
  {
    id: 'RUB-002',
    codigo: '212-04-01-02',
    descripcion: 'Equipos de Laboratorio',
    fichaId: 'PRG-001',
    programaFormacion: 'Formación Profesional Integral',
    montoAsignado: 350000000,
    saldoDisponible: 150000000,
    montoComprometido: 120000000,
    montoPagado: 80000000,
    retencionZese: 1875000,
    porcentajeEjecucion: 57.1,
  },
  {
    id: 'RUB-003',
    codigo: '212-04-01-03',
    descripcion: 'Servicios Públicos',
    fichaId: 'PRG-001',
    programaFormacion: 'Formación Profesional Integral',
    montoAsignado: 400000000,
    saldoDisponible: 250000000,
    montoComprometido: 130000000,
    montoPagado: 20000000,
    retencionZese: 1875000,
    porcentajeEjecucion: 37.5,
  },
  {
    id: 'RUB-004',
    codigo: '213-01-02-01',
    descripcion: 'Mantenimiento de Infraestructura',
    fichaId: 'PRG-002',
    programaFormacion: 'Gestión Administrativa Regional',
    montoAsignado: 500000000,
    saldoDisponible: 230000000,
    montoComprometido: 200000000,
    montoPagado: 70000000,
    retencionZese: 2500000,
    porcentajeEjecucion: 54.0,
  },
  {
    id: 'RUB-005',
    codigo: '213-01-02-02',
    descripcion: 'Gastos de Personal',
    fichaId: 'PRG-002',
    programaFormacion: 'Gestión Administrativa Regional',
    montoAsignado: 300000000,
    saldoDisponible: 150000000,
    montoComprometido: 120000000,
    montoPagado: 30000000,
    retencionZese: 1875000,
    porcentajeEjecucion: 50.0,
  },
  {
    id: 'RUB-006',
    codigo: '214-02-01-01',
    descripcion: 'Proyectos de Investigación',
    fichaId: 'PRG-003',
    programaFormacion: 'Investigación y Desarrollo (SENNOVA)',
    montoAsignado: 250000000,
    saldoDisponible: 12500000,
    montoComprometido: 200000000,
    montoPagado: 37500000,
    retencionZese: 2500000,
    porcentajeEjecucion: 95.0,
  },
  {
    id: 'RUB-007',
    codigo: '214-02-01-02',
    descripcion: 'Transferencia de Tecnología',
    fichaId: 'PRG-003',
    programaFormacion: 'Investigación y Desarrollo (SENNOVA)',
    montoAsignado: 200000000,
    saldoDisponible: 237500000,
    montoComprometido: 300000000,
    montoPagado: 554500000,
    retencionZese: 2500000,
    porcentajeEjecucion: 95.0,
  },
];

export const MOCK_AFECTACIONES: AfectacionPresupuestal[] = [
  {
    id: 'AFE-001',
    fecha: '28 Oct 2024, 14:32',
    tipo: 'Compromiso',
    documentoId: 'GIL-2024-045',
    documentoTipo: 'GIL',
    programa: 'Formación Profesional',
    rubro: '212-04-01-01',
    valor: 15200000,
    saldoResultante: 180000000,
  },
  {
    id: 'AFE-002',
    fecha: '27 Oct 2024, 09:15',
    tipo: 'Pago',
    documentoId: 'FEL-2024-112',
    documentoTipo: 'FEL',
    programa: 'Gestión Administrativa',
    rubro: '213-01-02-01',
    valor: 8450000,
    saldoResultante: 230000000,
  },
  {
    id: 'AFE-003',
    fecha: '26 Oct 2024, 16:48',
    tipo: 'Traslado',
    documentoId: 'TRD-2024-008',
    documentoTipo: 'GIL',
    programa: 'SENNOVA',
    rubro: '214-02-01-01',
    valor: 25000000,
    saldoResultante: 12500000,
  },
  {
    id: 'AFE-004',
    fecha: '25 Oct 2024, 11:00',
    tipo: 'Compromiso',
    documentoId: 'GIL-2024-044',
    documentoTipo: 'GIL',
    programa: 'Formación Profesional',
    rubro: '212-04-01-02',
    valor: 42000000,
    saldoResultante: 150000000,
  },
  {
    id: 'AFE-005',
    fecha: '24 Oct 2024, 08:30',
    tipo: 'Anulación',
    documentoId: 'GIL-2024-038',
    documentoTipo: 'GIL',
    programa: 'Gestión Administrativa',
    rubro: '213-01-02-02',
    valor: -5000000,
    saldoResultante: 155000000,
  },
];

export const MOCK_VENCIMIENTOS: VencimientoProximo[] = [
  {
    id: 'VEN-001',
    titulo: 'Cierre trimestral Q3',
    diasRestantes: 3,
    fechaVencimiento: '02 Nov 2024',
    icono: 'calendar-x',
    urgencia: 'critico',
  },
  {
    id: 'VEN-002',
    titulo: 'Pago FEL-2024-098',
    diasRestantes: 7,
    fechaVencimiento: '06 Nov 2024',
    icono: 'clock',
    urgencia: 'proximo',
  },
  {
    id: 'VEN-003',
    titulo: 'Revisión presupuestal',
    diasRestantes: 15,
    fechaVencimiento: '14 Nov 2024',
    icono: 'clipboard-check',
    urgencia: 'normal',
  },
];

export const MOCK_EJECUCION_MENSUAL: EjecucionMensual[] = [
  { mes: 'Ene', valor: 120, porcentaje: 48, esMesActual: false },
  { mes: 'Feb', valor: 95, porcentaje: 38, esMesActual: false },
  { mes: 'Mar', valor: 180, porcentaje: 72, esMesActual: false },
  { mes: 'Abr', valor: 150, porcentaje: 60, esMesActual: false },
  { mes: 'May', valor: 200, porcentaje: 80, esMesActual: false },
  { mes: 'Jun', valor: 175, porcentaje: 70, esMesActual: false },
  { mes: 'Jul', valor: 160, porcentaje: 64, esMesActual: false },
  { mes: 'Ago', valor: 220, porcentaje: 88, esMesActual: false },
  { mes: 'Sep', valor: 190, porcentaje: 76, esMesActual: false },
  { mes: 'Oct', valor: 250, porcentaje: 100, esMesActual: true },
];
