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
  nombre: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  urlImagen?: string | null;
  vrlAdjudicado: number | null;
  vrlAntes: number | null;
  iva: number | null;
  activo: boolean;
}

export interface CrearProductoRequest {
  codigoSena?: string;
  codigoProveedor?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  urlImagen?: string;
  vrlAdjudicado?: number | null;
  vrlAntes?: number | null;
  iva?: number | null;
}

export interface ActualizarProductoRequest {
  nombre: string;
  unidadMedida: string;
  descripcion?: string;
  categoria?: string;
  codigoProveedor?: string;
  urlImagen?: string;
  vrlAdjudicado?: number | null;
  vrlAntes?: number | null;
  iva?: number | null;
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
