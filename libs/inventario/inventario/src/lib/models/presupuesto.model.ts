// ============================================================
// Presupuesto General — Modelos e interfaces (F-08)
// RF-5.7.1 → RF-5.7.9, RF6.1.11
// ============================================================

export type TipoAfectacion = 'Compromiso' | 'Pago' | 'Traslado' | 'Anulación';
export type UrgenciaVencimiento = 'critico' | 'proximo' | 'normal';

/** Estado real del backend. 'VIGENTE' NO EXISTE — usar PENDIENTE|APLICADO|ANULADO */
export type EstadoCompromiso = 'PENDIENTE' | 'APLICADO' | 'ANULADO';

export interface Rubro {
  id: string;
  codigo: string;
  descripcion: string;
  fichaId: string;           // propagado desde el presupuesto padre
  programaFormacion: string; // propagado desde el presupuesto padre
  montoAsignado: number;
  saldoDisponible: number;   // = montoAsignado - montoComprometido (backend)
  montoComprometido: number;
  montoPagado: number;
  porcentajeEjecucion: number; // COMPUTADO en FE: (montoComprometido+montoPagado)/montoAsignado*100
  /** FE-only: sin fuente en el backend actual (NO existe en RubroResponse). Siempre 0. */
  retencionZese: number;
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
  /** FE-only: siempre 0 (sin fuente en el backend actual). */
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
  porcentajeEjecucion: number;
  /** FE-only: sin fuente en el backend actual. */
  totalZese: number;
  /** FE-only: sin fuente en el backend actual. */
  variacionAnual: number;
}

export interface AfectacionPresupuestal {
  /** Mapped from Compromiso.id */
  id: string;
  rubroId: string;
  gilId?: string;
  concepto: string;
  monto: number;
  montoRetencionZese: number;
  fecha: string;
  estado: EstadoCompromiso;
}

/** Mapped from VencimientoResponse — UI-ready */
export interface VencimientoProximo {
  /** facturaId from API */
  id: string;
  /** numeroFactura — proveedor from API */
  titulo: string;
  diasRestantes: number;
  fechaVencimiento: string;
  /** Computed from diasParaVencer */
  icono: string;
  /** Computed from diasParaVencer */
  urgencia: UrgenciaVencimiento;
  /** Extra raw fields */
  cufe: string;
  proveedor: string;
  gilId: string | null;
  montoTotal: number;
  estado: string;
}

/** Mapped from EjecucionMensualResponse — UI-ready */
export interface EjecucionMensual {
  /** Short label e.g. "Ene", "Feb" */
  mes: string;
  anio: number;
  mesNumero: number;
  montoComprometido: number;
  montoPagado: number;
  /** = montoComprometido + montoPagado */
  valor: number;
  /** Relative percentage vs max month in the dataset (computed FE) */
  porcentaje: number;
  esMesActual: boolean;
}

/** Detalle de un presupuesto (GET /budget/presupuestos/{id}) */
export interface PresupuestoDetalle {
  id: string;
  fichaId: string;
  programaFormacion: string;
  vigencia: number;
  fechaAprobacion: string;
  rubros: Rubro[];
}

/** Resumen global — GET /budget/presupuestos/resumen?vigencia */
export interface ResumenPresupuestosGlobal {
  totalPresupuestos:   number;
  vigencia:            number | null;
  totalAsignado:       number;
  totalComprometido:   number;
  totalPagado:         number;
  saldoGlobal:         number;
  porcentajeEjecucion: number;
}

/** Payload para registrar un nuevo presupuesto (POST /budget/presupuestos) */
export interface RegistrarPresupuestoData {
  fichaId: string;
  programaFormacion: string;
  vigencia: number;
  fechaAprobacion: string; // ISO date
  rubros: {
    codigo: string;
    descripcion: string;
    montoAsignado: number;
  }[];
}

/** Payload para trasladar saldo entre rubros — POST /budget/presupuestos/{id}/traslados */
export interface TrasladarRubroData {
  presupuestoId:  string;
  rubroOrigenId:  string;
  rubroDestinoId: string;
  monto:          number;
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
  estado: EstadoCompromiso;
}

/** Payload UI para comprometer presupuesto (POST /budget/compromisos) */
export interface ComprometerData {
  presupuestoId: string;
  rubroId: string;
  gilId: string; // REQUIRED por el backend
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

