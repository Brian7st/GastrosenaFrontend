/**
 * Modelo de dominio de Contratos de adjudicación de precios (catálogo).
 *
 * Un contrato versiona, por vigencia (año), los precios adjudicados de cada artículo.
 * El cruce con el catálogo de productos es POR DESCRIPCIÓN: el código SENA (almacén)
 * no viene en el contrato, por eso es opcional en cada ítem.
 */

export type EstadoContrato = 'VIGENTE' | 'CERRADO';

export interface ItemContrato {
  refArticulo: string;
  /** Opcional — el código de almacén SENA no viene en el contrato; se enlaza después. */
  codigoSena: string | null;
  descripcion: string;
  unidadMedida: string | null;
  cantidad: number | null;
  codigoProveedor: string | null;
  valorEstimado: number | null;
  vrlAdjudicado: number;
  vrlAntes: number | null;
  /** Fracción: 0, 0.05 o 0.19. */
  ivaPorcentaje: number | null;
  /** Calculado por el backend: vrlAntes * ivaPorcentaje. */
  ivaValor: number | null;
}

export interface Contrato {
  id: string;
  numero: string;
  descripcion: string | null;
  vigencia: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  estado: EstadoContrato;
  items: ItemContrato[];
}

// ── Datos de entrada (formularios / importación) ───────────────────────────────

export interface RegistrarItemContratoData {
  refArticulo: string;
  codigoSena?: string | null;
  descripcion: string;
  unidadMedida?: string | null;
  cantidad?: number | null;
  codigoProveedor?: string | null;
  valorEstimado?: number | null;
  vrlAdjudicado: number;
  vrlAntes?: number | null;
  ivaPorcentaje?: number | null;
}

export interface RegistrarContratoData {
  numero: string;
  descripcion?: string | null;
  vigencia: number;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  items: RegistrarItemContratoData[];
}

// ── Resultados ─────────────────────────────────────────────────────────────────

/** Resultado de importar un contrato: cuántos productos del catálogo se crearon/actualizaron. */
export interface ResultadoImportacion {
  contratoId: string;
  productosCreados: number;
  productosActualizados: number;
}

/** Fila del preview al importar un contrato desde CSV (cols B-K del Excel). */
export interface ContratoImportRow {
  refArticulo: string;
  codigoSena: string | null;
  descripcion: string;
  unidadMedida: string | null;
  cantidad: number | null;
  codigoProveedor: string | null;
  valorEstimado: number | null;
  vrlAdjudicado: number;
  vrlAntes: number | null;
  ivaPorcentaje: number | null;
  validacion: string;
  error?: string;
}

/** Precio adjudicado vigente de un artículo, base de la cascada tipo VLOOKUP. */
export interface PrecioVigente {
  codigoSena: string | null;
  refArticulo: string;
  descripcion: string;
  numeroContrato: string;
  vigencia: number;
  vrlAdjudicado: number;
  vrlAntes: number | null;
  ivaPorcentaje: number | null;
  ivaValor: number | null;
}
