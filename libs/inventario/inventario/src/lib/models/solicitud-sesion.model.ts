// ─── Modelo UI del módulo Training — Solicitudes de Sesión (RF-5.x) ─────────

export type EstadoSolicitudSesion =
  | 'PENDIENTE'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'COMPROMETIDA';

export interface SolicitudSesionItem {
  productoId:    string;
  cantidad:      number;
  unidadMedida:  string;
  justificacion: string;
}

export interface SolicitudSesion {
  id:                   string;
  fichaId:              string;
  programaId:           string;
  instructorId:         string;
  resultadoAprendizaje: string;
  actividades:          string;
  voceroId:             string;
  estado:               string;
  items:                SolicitudSesionItem[];
}

/** Payload para crear una solicitud de sesión (POST /training/solicitudes) */
export interface CrearSolicitudSesionData {
  fichaId:              string;
  programaId:           string;
  instructorId:         string;
  resultadoAprendizaje: string;
  actividades:          string;
  voceroId:             string;
  items: SolicitudSesionItem[];
}

/** Payload para aprobar (PATCH /training/solicitudes/{id}/aprobar) */
export interface AprobarSesionData {
  aprobadorId:    string;
  observaciones?: string;
}

/** Payload para rechazar (PATCH /training/solicitudes/{id}/rechazar) */
export interface RechazarSesionData {
  aprobadorId: string;
  motivo:      string;
}
