export interface AlertaResponse {
  id: string;
  tipo: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  referenciaId: string;
  referenciaTipo: string;
  descripcion: string;
  destinatarioId: string;
  destinatarioRol: string;
  fechaGeneracion: string;
  estado: 'ACTIVA' | 'CRITICA' | 'RESUELTA';
  fechaResolucion?: string;
  accionResolucion?: string;
  resueltoPorId?: string;
  codigoSena?: string;
  nombreBien?: string;
  stockActual?: number;
  stockMinimo?: number;
  unidad?: string;
}

export interface ResolverAlertaRequest {
  accionResolucion: string;
  resueltoPorId: string;
  observaciones?: string;
}

/** GET /alerts/alertas/umbrales — existencia con flags de stock */
export interface UmbralStockResponse {
  productoId: string;
  stockFisico: number;
  stockDisponible: number;
  stockMinimo: number;
  bajoMinimo: boolean;
}

/** PUT /alerts/alertas/umbrales/{productoId} */
export interface ActualizarUmbralRequest {
  nuevoMinimo: number;
}
