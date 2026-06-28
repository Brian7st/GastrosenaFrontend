export interface BienInactivo {
  id: string;
  descripcion: string;
  codigoSena: string | null;
  activo: boolean;
  fechaRegistro: string;
}

export interface MotivoOmision {
  productoId: string;
  codigoSena: string | null;
  descripcion: string;
  motivo: string;
}

export interface RespuestaLimpieza {
  borrados: number;
  omitidos: number;
  motivosOmision: MotivoOmision[];
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
