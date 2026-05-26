// ─── Modelos UI del módulo Reporting ────────────────────────────────────────

export interface EjecucionPresupuestal {
  fichaId:             string;
  programaFormacion:   string;
  vigencia:            number;
  totalPresupuestado:  number;
  totalComprometido:   number;
  totalPagado:         number;
  porcentajeEjecucion: number;
  saldoDisponible:     number;
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
