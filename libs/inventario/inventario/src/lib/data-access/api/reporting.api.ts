// ─── DTOs de la API de Reporting /api/v1/reporting ──────────────────────────

/**
 * GET /reporting/ejecucion-presupuestal?fichaId?&vigencia?
 * Respuesta: EjecucionPresupuestalView[] (flat array — campo a campo real del backend)
 * NOTA: porcentajeEjecucion NO viene en el JSON — computar en FE.
 */
export interface EjecucionPresupuestalItemResponse {
  presupuestoId:      string;
  fichaId:            string;
  programaFormacion:  string;
  vigencia:           number;
  rubroId:            string;
  rubroCodigo:        string;
  rubroDescripcion:   string;
  montoAsignado:      number;
  montoComprometido:  number;
  montoPagado:        number;
  saldoDisponible:    number;
}

/** GET /reporting/kardex?productoId?&desde?&hasta? */
export interface KardexValorizadoItemResponse {
  fecha:            string;
  tipo:             string;
  productoId:       string;
  productoNombre:   string;
  cantidad:         number;
  precioUnitario:   number;
  valorTotal:       number;
  saldoUnidades:    number;
  saldoValorizado:  number;
}

/** GET /reporting/consumo?fichaId?&instructorId?&desde?&hasta? */
export interface ConsumoItemResponse {
  instructorId:      string;
  instructorNombre:  string;
  fichaId:           string;
  programaFormacion: string;
  productoId:        string;
  productoNombre:    string;
  cantidadConsumida: number;
  valorTotal:        number;
  fecha:             string;
}

/** GET /reporting/trazabilidad?fichaId?&desde?&hasta? */
export interface TrazabilidadDocumentalItemResponse {
  fichaId:           string;
  programaFormacion: string;
  instructorId:      string;
  instructorNombre:  string;
  requisicionId?:    string;
  actaId?:           string;
  paqueteId?:        string;
  gilId?:            string;
  facturaId?:        string;
  estado:            string;
  fecha:             string;
}

/** GET /reporting/vencimientos?dias=30 */
export interface VencimientoResponse {
  facturaId:        string;
  cufe:             string;
  numeroFactura:    string;
  proveedor:        string;
  gilId:            string | null;
  montoTotal:       number;
  fechaVencimiento: string; // ISO date
  diasParaVencer:   number;
  estado:           string;
}

/** GET /reporting/ejecucion-mensual?fichaId&vigencia */
export interface EjecucionMensualResponse {
  anio:               number;
  mes:                number;
  montoComprometido:  number;
  montoPagado:        number;
}

/** GET /reporting/alertas/resumen?destinatarioId? */
export interface ResumenAlertasResponse {
  totalAlertas:       number;
  alertasPendientes:  number;
  alertasResueltas:   number;
  productosCriticos:  number;
  alertasPorTipo:     { tipo: string; cantidad: number }[];
  ultimaAlerta?:      string;
}
