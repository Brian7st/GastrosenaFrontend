// ──────────────────────────────────────────────────────────────────────────────
// Modelos del módulo de Conciliación de Inventario (RF-5.8)
// ──────────────────────────────────────────────────────────────────────────────

export interface ConciliacionRegistro {
  id: string;
  fecha: string;
  ubicacion: string;
  itemsTotal: number;
  itemsDif: number;
  precision: number;
  estado: string;
  estadoColor: 'success' | 'info' | 'warning' | 'error';
}

export interface ConciliacionDetalle {
  id: string;
  fecha: string;
  responsable: string;
  estado: string;
  totalItemsContados: number;
  diferencias: number;
  precision: number;
  valorTotalDiferencias: number;
}

/**
 * DiferenciaItem: versión tipada con valores numéricos.
 * Sustituye a ConciliacionDiferencia eliminando los strings combinados.
 */
export interface DiferenciaItem {
  id:            string;
  producto:      string;
  codigo:        string;
  categoria:     string;
  stockSistema:  number;
  stockFisico:   number;
  diferencia:    number;
  unidad:        string;
  valorUnit:     number;
  impacto:       number;
  estado:        string;
  justificacion: string | null;
}

export interface TomaFisicaItem {
  id: string;
  codigoSena: string;
  categoria: string;
  producto: string;
  stockSistema: number;
  conteoFisico: number | null;
  valorUnitario: number;
}

/** Payload UI para registrar el conteo físico de un ítem
 *  (POST /reconciliation/conciliaciones/{id}/conteo) */
export interface ConteoItemData {
  codigoSena: string;
  descripcion: string;
  cantidadSistema: number;
  cantidadFisica: number;
  valorUnitario: number;
}
