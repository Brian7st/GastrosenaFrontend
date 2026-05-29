// ─── DTOs de la API de Reporting /api/v1/reporting ──────────────────────────

/** GET /reporting/ejecucion-presupuestal?fichaId?&vigencia? */
export interface EjecucionPresupuestalItemResponse {
  fichaId:             string;
  programaFormacion:   string;
  vigencia:            number;
  totalPresupuestado:  number;
  totalComprometido:   number;
  totalPagado:         number;
  porcentajeEjecucion: number;
  saldoDisponible:     number;
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

/** GET /reporting/alertas/resumen?destinatarioId? */
export interface ResumenAlertasResponse {
  totalAlertas:       number;
  alertasPendientes:  number;
  alertasResueltas:   number;
  productosCriticos:  number;
  alertasPorTipo:     { tipo: string; cantidad: number }[];
  ultimaAlerta?:      string;
}
