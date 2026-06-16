/**
 * GET /inventory/movimientos/{productoId} — response paginado.
 * El backend no documenta el schema en Swagger (type: object genérico).
 * Se soportan ambas convenciones: inglés (content/totalElements) y
 * español (contenido/totalElementos) para cubrir las variaciones del backend.
 */
export interface MovimientoPageResponse {
  // Clave real del backend (KardexHttpResponse): array bajo `movimientos`
  movimientos?:   MovimientoResponse[];
  // Convención inglés (Spring Page<T> estándar — igual que PagedGilResponse)
  content?:       MovimientoResponse[];
  totalElements?: number;
  totalPages?:    number;
  number?:        number;
  size?:          number;
  // Convención español (patrón interno de otros módulos)
  contenido?:       MovimientoResponse[];
  totalElementos?:  number;
  totalPaginas?:    number;
  paginaActual?:    number;
  tamano?:          number;
}

export interface ExistenciaResponse {
  productoId: string;
  stockFisico: number;
  stockReservado: number;
  stockDisponible: number;
  stockMinimo: number;
  bajoMinimo: boolean;
}

export interface MovimientoResponse {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'RESERVA' | 'LIBERACION' | 'AJUSTE';
  productoId: string;
  productoNombre: string;
  codigoSena: string;
  cantidad: number;
  unidadMedida: string;
  fechaMovimiento: string;
  responsableId: string;
  responsableNombre: string;
  valor: number;
  estado: 'Completado' | 'Pendiente' | 'Cancelado';
}

/** RegistrarSalidaHttpRequest — POST /api/v1/inventory/movimientos/salida */
export interface SalidaRequest {
  productoId:    string;
  cantidad:      number;
  requisicionId: string;
  instructorId:  string;
  categoria:     string;
}

export interface ReservaRequest {
  productoId: string;
  cantidad: number;
  fichaId: string;
  instructorId: string;
  observaciones?: string;
}

export interface LiberacionRequest {
  productoId: string;
  cantidad: number;
  motivo: string;
}

/** AjustarInventarioHttpRequest — POST /api/v1/inventory/movimientos/ajuste */
export interface AjusteRequest {
  productoId: string;
  cantidadNueva: number;
  motivo: string;
  autorizado: boolean;
  referenciaId: string | null;
}

// ── Documentos agrupados (GET /inventory/movimientos) ─────────────────────

export interface DocumentoResponse {
  tipo: 'ENTRADA' | 'SALIDA';
  documentoId: string;
  numeroDocumento: string | null;
  cantidadBienes: number;
  cantidadTotal: number;
  valorTotal: number;
  fecha: string;
  estado: 'Completado' | 'Pendiente' | 'Cancelado';
}

export interface DocumentoPageResponse {
  documentos?: DocumentoResponse[];
  paginaActual?: number;
  totalPaginas?: number;
  totalElementos?: number;
  tamano?: number;
}

/** GET /inventory/movimientos/documento/{documentoId}?tipo= */
export interface DocumentoDetalleResponse {
  tipo: 'ENTRADA' | 'SALIDA';
  documentoId: string;
  numeroDocumento: string | null;
  bienes: MovimientoResponse[];
}
