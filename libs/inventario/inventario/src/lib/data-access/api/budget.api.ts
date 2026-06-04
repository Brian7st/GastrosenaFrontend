// ─── DTOs reales del backend /api/v1/budget ──────────────────────────────────

import { EstadoCompromiso } from '../../models/presupuesto.model';

// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  contenido:       T[];
  paginaActual:    number;
  totalPaginas:    number;
  totalElementos:  number;
  tamano:          number;
}

// ── Presupuestos ──────────────────────────────────────────────────────────────

/** Rubro dentro de un presupuesto (GET /budget/presupuestos o /{id}) */
export interface RubroResponse {
  id:                 string;
  codigo:             string;
  descripcion:        string;
  montoAsignado:      number;
  montoComprometido:  number;
  montoPagado:        number;
  saldoDisponible:    number;
  // NOTE: NO retencionZese, NO porcentajeEjecucion — compute on FE
}

/** GET /budget/presupuestos?fichaId&vigencia&page&size — item en contenido[] */
export interface PresupuestoResponse {
  id:                string;
  fichaId:           string;
  programaFormacion: string;
  vigencia:          number;
  fechaAprobacion:   string;
  rubros:            RubroResponse[];
}

/** GET /budget/presupuestos/{id} — misma forma que PresupuestoResponse */
export type PresupuestoDetalleResponse = PresupuestoResponse;

/** POST /budget/presupuestos — body */
export interface RegistrarPresupuestoRequest {
  fichaId:           string;
  programaFormacion: string;
  vigencia:          number;
  fechaAprobacion:   string; // ISO date
  rubros: {
    codigo:         string;
    descripcion:    string;
    montoAsignado:  number;
  }[];
}

/** POST /budget/presupuestos — respuesta 201 */
export interface RegistrarPresupuestoResponse {
  id: string;
}

// ── Compromisos ───────────────────────────────────────────────────────────────

/** GET /budget/compromisos?presupuestoId&estado → flat array */
export interface CompromisoResponse {
  id:                 string;
  presupuestoId:      string;
  rubroId:            string;
  gilId?:             string;
  concepto:           string;
  monto:              number;
  montoRetencionZese: number;
  fecha:              string;
  estado:             EstadoCompromiso; // PENDIENTE | APLICADO | ANULADO
}

/** POST /budget/compromisos */
export interface ComprometerRequest {
  presupuestoId: string;
  rubroId:       string;
  gilId:         string; // REQUIRED
  facturaId?:    string;
  fichaId:       string;
  programaId:    string;
  concepto:      string;
  monto:         number;
  aplicarZESE:   boolean;
  fecha:         string;
}

/** POST /budget/compromisos/{id}/pagos */
export interface PagoRequest {
  cufeFuenteId: string;
  monto:        number;
  fecha:        string;
}

// ── Consolidados ──────────────────────────────────────────────────────────────

/** Línea dentro de un consolidado (real backend shape) */
export interface LineaConsolidadoResponse {
  gilId:          string;
  compromisoId:   string;
  facturaId:      string;
  concepto:       string;
  fecha:          string;
  numeroFactura:  string;
  cufe:           string;
  monto:          number;
  retencionZese:  number;
}

/** Totales dentro de un consolidado (real backend shape) */
export interface TotalesConsolidadoResponse {
  sumaMontos:        number;
  sumaRetencionZese: number;
  valorNeto:         number;
}

export type EstadoConsolidado = 'GENERADO' | 'REVERSADO';

/** GET /budget/consolidados → contenido[] | GET /budget/consolidados/{numero} */
export interface ConsolidadoResponse {
  id:              string;
  numero:          number;
  fechaGeneracion: string;
  generadoPor:     string;
  estado:          EstadoConsolidado;
  lineas:          LineaConsolidadoResponse[];
  totales:         TotalesConsolidadoResponse;
}

/** GET /budget/presupuestos/resumen?vigencia */
export interface ResumenPresupuestosResponse {
  totalPresupuestos:   number;
  vigencia:            number | null;
  totalAsignado:       number;
  totalComprometido:   number;
  totalPagado:         number;
  saldoGlobal:         number;
  porcentajeEjecucion: number;
}

/** GET /budget/consolidados/elegibles */
export interface ElegibleConsolidadoResponse {
  compromisoId:   string;
  gilId:          string;
  facturaId:      string;
  concepto:       string;
  fecha:          string;
  numeroFactura:  string;
  cufe:           string;
  monto:          number;
  retencionZese:  number;
}

/** POST /budget/consolidados — body */
export interface GenerarConsolidadoRequest {
  lineas: {
    gilId:         string;
    compromisoId:  string;
    facturaId:     string;
    concepto:      string;
    fecha:         string; // ISO date
    numeroFactura: string;
    cufe:          string;
    monto:         number;
    retencionZese: number;
  }[];
  generadoPor: string;
}
