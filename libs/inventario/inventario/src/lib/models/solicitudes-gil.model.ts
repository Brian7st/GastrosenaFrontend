export type EstadoGil = 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'VERIFICADO' | 'CERRADO';

export interface CuentadanteGil {
  id?: string | number;
  nombre: string;
  cedula?: string;        // era: documento — alineado con backend CuentadanteHttpRequest
}

export interface BienSolicitud {
  codigoSena: string;     // era: codigo
  descripcion: string;
  unidadMedida: string;   // era: um
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

export interface SolicitudGil {
  id: string | number;
  numeroGil: string;                  // Consecutivo GIL-F-014-YYYY-NNN
  fechaSolicitud: string;             // era: fecha
  regionalCodigo: number;             // era: centroFormacionId (parte 1)
  regionalNombre: string;             // era: centroFormacionId (parte 2)
  centroCostosCodigo: number;         // nuevo — requerido por backend
  centroCostosNombre: string;         // nuevo — requerido por backend
  area: string;
  destinoBienes: string;              // era: destino
  jefeOficinaCoordinador: string;     // nuevo — requerido por backend
  cuentadantes: CuentadanteGil[];
  solicitante: string;                // nuevo — requerido por backend
  codigoGrupo?: string;               // opcional
  estado: EstadoGil;
  observaciones?: string;
  bienes?: BienSolicitud[];
  creadoEn?: string;
  actualizadoEn?: string;
  // Campos opcionales heredados del módulo training/sesiones
  programaId?: string;
  emitidoPor?: string;
  resultadoAprendizaje?: string;
  actividades?: string;
  voceroNombre?: string;
  voceroDocumento?: string;
  solicitudesOrigenIds?: string[];
}

export interface SolicitudesGilFiltros {
  estado?: EstadoGil;
  codigoGrupo?: string;
  page?: number;
  size?: number;
  // Campos de UI sin soporte backend aún (no se envían como HTTP params):
  busqueda?: string;
  instructor?: string;
  fechaRango?: string;
}

export interface SolicitudesPaginacion {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** Payload para POST /api/v1/procurement/giles */
export interface CrearSolicitudData {
  fechaSolicitud: string;
  regionalCodigo: number;
  regionalNombre: string;
  centroCostosCodigo: number;
  centroCostosNombre: string;
  area: string;
  destinoBienes: string;
  jefeOficinaCoordinador: string;
  cuentadantes: { nombre: string; cedula: string }[];
  solicitante: string;
  codigoGrupo?: string;
  solicitudesOrigenIds?: string[];
  bienes: { codigoSena: string; descripcion: string; unidadMedida: string; cantidad: number; valorUnitario: number; subtotal: number }[];
  observaciones?: string;
}

/** Payload para PATCH /api/v1/procurement/giles/{id} */
export type ActualizarSolicitudData = Partial<CrearSolicitudData>;

/** Payload para POST /api/v1/procurement/giles/generar */
export interface GenerarGilData {
  solicitudSesionIds: string[];
  fechaSolicitud: string;
  regionalCodigo: number;
  regionalNombre: string;
  centroCostosCodigo: number;
  centroCostosNombre: string;
  area: string;
  destinoBienes: string;
  jefeOficinaCoordinador: string;
  cuentadantes: { nombre: string; cedula: string }[];
  solicitante: string;
  codigoGrupo: string;
  observaciones?: string;
}
