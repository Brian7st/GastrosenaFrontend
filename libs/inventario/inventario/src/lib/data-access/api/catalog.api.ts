/** Wrapper paginado Spring estándar — usado por solicitudes-gil y facturas */
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** Wrapper paginado del catálogo de productos — ProductosPageHttpResponse Java
 *  Usa nombres en español: contenido, paginaActual, totalPaginas, totalElementos, tamano */
export interface CatalogoPageResponse<T> {
  contenido: T[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  tamano: number;
}

export interface ProductoResponse {
  id: string;
  codigoSena: string;
  codigoProveedor?: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  vrlAdjudicado: number | null;
  vrlAntes: number | null;
  iva: number | null;
  stockMinimo: number | null;
  activo: boolean;
}

export interface CrearProductoRequest {
  codigoSena?: string;
  codigoProveedor?: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  vrlAdjudicado?: number | null;
  vrlAntes?: number | null;
  iva?: number | null;
  stockMinimo?: number | null;
}

export interface ActualizarProductoRequest {
  unidadMedida: string;
  /** Opcional. El backend lo asigna SOLO si el producto aún no tiene código; si ya tiene, lo ignora. */
  codigoSena?: string | null;
  descripcion?: string;
  categoria?: string;
  codigoProveedor?: string;
  vrlAdjudicado?: number | null;
  vrlAntes?: number | null;
  iva?: number | null;
  stockMinimo?: number | null;
}

/** POST /catalog/productos/eliminacion-masiva */
export interface EliminarProductosMasivaRequest {
  ids: string[];
  confirmacion: string;
}

export interface EliminacionMasivaResponse {
  idsEliminados: string[];
}

/** POST /catalog/productos/importar */
export interface ImportarProductosRequest {
  productos: CrearProductoRequest[];
}

/** POST /catalog/productos/exportaciones (202 Accepted — async) */
export interface SolicitarExportacionRequest {
  formato: 'CSV';
}

export interface ExportacionProductosResponse {
  exportId: string;
  estado: string;
  formato: 'CSV';
  totalProductos: number;
}

// ── Contratos (/catalog/contratos) ─────────────────────────────────────────────

export interface ItemContratoResponse {
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
  ivaValor: number | null;
}

export interface ContratoResponse {
  id: string;
  numero: string;
  descripcion: string | null;
  vigencia: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  estado: string;
  items: ItemContratoResponse[];
}

export interface ItemContratoRequest {
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

export interface RegistrarContratoRequest {
  numero: string;
  descripcion?: string | null;
  vigencia: number;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  items: ItemContratoRequest[];
}

/** POST /catalog/contratos — 201 */
export interface ContratoCreatedResponse {
  id: string;
}

/** POST /catalog/contratos/importar — 201 */
export interface ImportacionContratoResponse {
  contratoId: string;
  productosCreados: number;
  productosActualizados: number;
}

/** PATCH /catalog/contratos/{id}/cerrar — 200 OK */
export interface CierreContratoResponse {
  contratoId: string;
  bienesDesactivados: number;
}

/** GET /catalog/contratos/precio?codigoSena&vigencia */
export interface PrecioVigenteResponse {
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
