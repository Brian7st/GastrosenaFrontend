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
  activo: boolean;
}

export interface CrearProductoRequest {
  codigoSena?: string;
  codigoProveedor?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
}

export type ActualizarProductoRequest = Partial<CrearProductoRequest>;
