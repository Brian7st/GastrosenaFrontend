// ─── DTOs de la API de Training /api/v1/training/solicitudes ────────────────

export interface SolicitudSesionItemResponse {
  productoId: string;
  cantidad:   number;
  unidadMedida: string;
  justificacion: string;
}

/** GET /training/solicitudes/{id} — también como respuesta de POST y PATCH */
export interface SolicitudSesionResponse {
  id:                    string;
  fichaId:               string;
  programaId:            string;
  instructorId:          string;
  resultadoAprendizaje:  string;
  actividades:           string;
  voceroId:              string;
  estado:                string;
  items:                 SolicitudSesionItemResponse[];
}

/** POST /training/solicitudes */
export interface CrearSolicitudSesionRequest {
  fichaId:               string;
  programaId:            string;
  instructorId:          string;
  resultadoAprendizaje:  string;
  actividades:           string;
  voceroId:              string;
  items: {
    productoId:    string;
    cantidad:      number;
    unidadMedida:  string;
    justificacion: string;
  }[];
}

/** PATCH /training/solicitudes/{id}/aprobar */
export interface AprobarSolicitudSesionRequest {
  aprobadorId:   string;
  observaciones?: string;
}

/** PATCH /training/solicitudes/{id}/rechazar */
export interface RechazarSolicitudSesionRequest {
  aprobadorId: string;
  motivo:      string;
}
