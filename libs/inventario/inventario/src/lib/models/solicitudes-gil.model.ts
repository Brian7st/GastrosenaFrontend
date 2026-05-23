export type EstadoGil = 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO';

export interface CuentadanteGil {
  id: string | number;
  nombre: string;
  documento?: string;
}

export interface SolicitudGil {
  id: string | number;
  numeroGil: string;           // Consecutivo GIL-F-014-YYYY-NNN
  fecha: string;               // Fecha de emisión o creación
  centroFormacionId: string;
  area: string;
  cuentadantes: CuentadanteGil[];
  destino: string;
  fichaId: string;             // Código tipo ADSO-2670687
  estado: EstadoGil;
  programaId?: string;
  emitidoPor?: string;
  resultadoAprendizaje?: string;
  actividades?: string;
  voceroNombre?: string;
  voceroDocumento?: string;
  solicitudesOrigenIds?: string[];
  observaciones?: string;
  bienes?: BienSolicitud[];
}

export interface BienSolicitud {
  codigo: string;
  descripcion: string;
  um: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

export interface SolicitudesGilFiltros {
  busqueda?: string;
  instructor?: string;
  estado?: EstadoGil;
  fechaRango?: string;
}

export interface CrearSolicitudData {
  fecha: string;
  centroFormacionId?: string;
  area?: string;
  cuentadantes?: CuentadanteGil[];
  destino?: string;
  fichaId?: string;
}

export interface ActualizarSolicitudData {
  centroFormacionId?: string;
  area?: string;
  cuentadantes?: CuentadanteGil[];
  destino?: string;
  fichaId?: string;
}
