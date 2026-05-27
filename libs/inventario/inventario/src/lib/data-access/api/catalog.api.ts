export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
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
}

export interface ActualizarProductoRequest {
  nombre: string;
  unidadMedida: string;
  descripcion?: string;
  categoria?: string;
  codigoProveedor?: string;
  urlImagen?: string;
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
  formato: 'CSV' | 'EXCEL';
}

export interface ExportacionProductosResponse {
  exportId: string;
  estado: string;
  formato: 'CSV' | 'EXCEL';
  totalProductos: number;
}
