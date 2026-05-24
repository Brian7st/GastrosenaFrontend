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

export interface CompromisoResponse {
  id: string;
  gilId: string;
  presupuestoId: string;
  monto: number;
  estado: 'ACTIVO' | 'ANULADO' | 'PAGADO';
  fecha: string;
}

export interface ComprometerRequest {
  gilId: string;
  presupuestoId: string;
  monto: number;
}

export interface PagoRequest {
  monto: number;
  fecha: string;
  referencia: string;
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
