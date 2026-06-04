// ─── Modelos UI del módulo Reporting ────────────────────────────────────────

/** GET /reporting/ejecucion-presupuestal — campos reales del backend */
export interface EjecucionPresupuestal {
  presupuestoId:       string;
  fichaId:             string;
  programaFormacion:   string;
  vigencia:            number;
  rubroId:             string;
  rubroCodigo:         string;
  rubroDescripcion:    string;
  montoAsignado:       number;
  montoComprometido:   number;
  montoPagado:         number;
  saldoDisponible:     number;
  /** COMPUTADO en FE: (montoComprometido+montoPagado)/montoAsignado*100, guard zero */
  porcentajeEjecucion: number;
}

export interface KardexValorizadoItem {
  fecha:           string;
  tipo:            string;
  productoId:      string;
  productoNombre:  string;
  cantidad:        number;
  precioUnitario:  number;
  valorTotal:      number;
  saldoUnidades:   number;
  saldoValorizado: number;
}

export interface ConsumoItem {
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

export interface TrazabilidadDocumental {
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

export interface ResumenAlertas {
  totalAlertas:      number;
  alertasPendientes: number;
  alertasResueltas:  number;
  productosCriticos: number;
  alertasPorTipo:    { tipo: string; cantidad: number }[];
  ultimaAlerta?:     string;
}

/** Filtros compartidos para los endpoints de reporting */
export interface ReportingFiltros {
  fichaId?:      string;
  instructorId?: string;
  vigencia?:     number;
  productoId?:   string;
  desde?:        string;
  hasta?:        string;
  destinatarioId?: string;
}
