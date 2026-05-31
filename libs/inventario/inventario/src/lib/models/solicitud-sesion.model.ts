// ─── Modelo UI del módulo Training — Solicitudes de Sesión (RF-5.x) ─────────

export type EstadoSolicitudSesion =
  | 'CREADA'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'COMPROMETIDA';

export interface SolicitudSesionItem {
  codigoSena:               string;
  nombreBien?:              string;
  descripcion?:             string;
  cantidad:                 number;
  valorUnitarioAdjudicado?: number;
  codigoAlmacen?:           string;
  unidadMedida:             string;
  valorUnitario?:           number;
  total?:                   number;
  iva?:                     number;
}

export interface SolicitudSesion {
  id:                       string;
  fechaSolicitud?:          string;
  numeroSolicitud?:         number;
  fichaId:                  string;
  programaId:               string;
  instructorId:             string;
  identificacionInstructor?: string;
  estado:                   string;
  items:                    SolicitudSesionItem[];
  valorTotalDeSolicitud?:   number;
}

/** Payload para crear una solicitud de sesión (POST /training/solicitudes) */
export interface CrearSolicitudSesionData {
  fechaSolicitud?:          string;
  numeroSolicitud?:         number;
  fichaId:                  string;
  programaId:               string;
  instructorId:             string;
  identificacionInstructor?: string;
  valorTotalDeSolicitud?:   number;
  items: SolicitudSesionItem[];
}

/** Payload para actualizar una solicitud de sesión (PUT /training/solicitudes/{id}) */
export interface ActualizarSolicitudSesionData {
  fechaSolicitud?:           string;
  fichaId:                   string;
  programaId:                string;
  instructorId:              string;
  identificacionInstructor?: string;
  valorTotalDeSolicitud?:    number;
  items:                     SolicitudSesionItem[];
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
