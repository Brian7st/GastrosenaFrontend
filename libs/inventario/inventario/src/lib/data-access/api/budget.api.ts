export interface PresupuestoResponse {
  id: string;
  codigo: string;
  descripcion: string;
  fichaId: string;
  programaFormacion: string;
  montoAsignado: number;
  saldoDisponible: number;
  montoComprometido: number;
  montoPagado: number;
  retencionZese: number;
  porcentajeEjecucion: number;
}

export interface RegistrarPresupuestoRequest {
  programaId: string;
  vigenciaFiscal: number;
  nombreRubro: string;
  codigoPresupuestal: string;
  bolsaInicial: number;
}

/** GET /budget/compromisos — item de la lista */
export interface CompromisoResponse {
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

/** POST /budget/compromisos */
export interface ComprometerRequest {
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

/** POST /budget/compromisos/{id}/pagos */
export interface PagoRequest {
  cufeFuenteId: string;
  monto: number;
  fecha: string;
}

export interface LineaConsolidadoResponse {
  id: string;
  tipo: string;
  referencia: string;
  descripcion: string;
  cantidad: number;
  valor: number;
}

export interface TotalesConsolidadoResponse {
  totalBienes: number;
  totalServicios: number;
  totalGeneral: number;
}

export interface ConsolidadoResponse {
  id: string;
  numero: number;
  fechaGeneracion: string;
  generadoPor: string;
  estado: 'GENERADO' | 'CONTABILIZADO' | 'REVERSADO';
  lineas: LineaConsolidadoResponse[];
  totales: TotalesConsolidadoResponse;
}

export interface GenerarConsolidadoRequest {
  gilIds: string[];
}
