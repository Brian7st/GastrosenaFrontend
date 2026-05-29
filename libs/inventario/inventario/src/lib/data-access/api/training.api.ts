// ─── DTOs de la API de Training /api/v1/training/solicitudes ────────────────

/** Item en responses de solicitud (GET lista, GET detail, POST, PATCH) */
export interface SolicitudSesionItemResponse {
  codigoSena:              string;
  nombreBien?:             string;
  descripcion?:            string;
  cantidad:                number;
  valorUnitarioAdjudicado?: number;
  codigoAlmacen?:          string;
  unidadMedida:            string;
  valorUnitario?:          number;
  total?:                  number;
  iva?:                    number;
}

/** Response de POST, PATCH y cada elemento del GET lista */
export interface SolicitudSesionResponse {
  id:                       string;
  fechaSolicitud?:          string;
  numeroSolicitud?:         number;
  fichaId:                  string;
  programaId:               string;
  instructorId:             string;
  identificacionInstructor?: string;
  estado:                   string;
  items:                    SolicitudSesionItemResponse[];
  valorTotalDeSolicitud?:   number;
}

/** Filtros para GET /training/solicitudes */
export interface SolicitudesSesionFiltros {
  instructorId?: string;
  estado?:       string;
}

/** POST /training/solicitudes */
export interface CrearSolicitudSesionRequest {
  fechaSolicitud?:          string;
  numeroSolicitud?:         number;
  fichaId:                  string;
  programaId:               string;
  instructorId:             string;
  identificacionInstructor?: string;
  valorTotalDeSolicitud?:   number;
  items: {
    codigoSena:              string;
    nombreBien?:             string;
    descripcion?:            string;
    cantidad:                number;
    valorUnitarioAdjudicado?: number;
    codigoAlmacen?:          string;
    unidadMedida:            string;
    valorUnitario?:          number;
    total?:                  number;
    iva?:                    number;
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
