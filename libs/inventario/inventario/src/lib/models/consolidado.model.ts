// ============================================================
// Consolidado de Ejecución Presupuestal — Modelos (F-09)
// Real backend contract: GET /api/v1/budget/consolidados
// ============================================================

export interface LineaConsolidado {
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

export interface TotalesConsolidado {
  sumaMontos:         number;
  sumaRetencionZese:  number;
  valorNeto:          number;
}

export type EstadoConsolidado = 'GENERADO' | 'REVERSADO';

export interface Consolidado {
  id:               string;
  numero:           number;
  fechaGeneracion:  string;
  generadoPor:      string;
  estado:           EstadoConsolidado;
  lineas:           LineaConsolidado[];
  totales:          TotalesConsolidado;
}

// ── Payload para generar un consolidado ──────────────────────────────────────

export interface LineaConsolidadoInput {
  gilId:          string;
  compromisoId:   string;
  facturaId:      string;
  concepto:       string;
  fecha:          string; // ISO date
  numeroFactura:  string;
  cufe:           string;
  monto:          number;
  retencionZese:  number;
}

export interface GenerarConsolidadoData {
  lineas:      LineaConsolidadoInput[];
  generadoPor: string;
}

// ── ElegibleConsolidado: candidatos reales del backend ───────────────────────

/** Item devuelto por GET /budget/consolidados/elegibles — todos los campos
 *  mapean 1:1 a una línea del POST /consolidados. */
export interface ElegibleConsolidado {
  compromisoId:  string;
  gilId:         string;
  facturaId:     string;
  concepto:      string;
  fecha:         string;
  numeroFactura: string;
  cufe:          string;
  monto:         number;
  retencionZese: number;
  /** FE-only: controla la selección en la tabla */
  selected:      boolean;
}

// ── GilItem: tipo UI legacy — se mantiene para no romper compilación ─────────
export type GilEstado = 'Disponible' | 'En otro consolidado';

export interface GilItem {
  id:              string;
  codigo:          string;
  instructor:      string;
  programa:        string;
  ficha:           string;
  fecha:           string;
  valor:           number;
  estado:          GilEstado | string;
  consolidadoRef?: string;
  selected:        boolean;
}
