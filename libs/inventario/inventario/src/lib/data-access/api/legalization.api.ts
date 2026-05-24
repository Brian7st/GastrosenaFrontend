export interface ActaResponse {
  id: string;
  numeroActa: string;
  fecha: string;
  programa: string;
  fichaId: string;
  instructorId: string;
  requisicionId: string;
  estado: 'BORRADOR' | 'PENDIENTE_FIRMAS' | 'FIRMADA' | 'REVISADA' | 'ARCHIVADA';
  ciudad?: string;
  lugar?: string;
  agendaSesion?: string;
  desarrolloSesion?: string;
  resultadoAprendizaje?: string;
  actividadesEjecutadas?: string;
}

export interface CrearActaRequest {
  programa: string;
  fichaId: string;
  instructorId: string;
  requisicionId: string;
  ciudad?: string;
  lugar?: string;
  agendaSesion?: string;
  desarrolloSesion?: string;
  resultadoAprendizaje?: string;
  actividadesEjecutadas?: string;
}

export interface PaqueteResponse {
  id: string;
  expediente: string;
  titulo: string;
  fichaId: string;
  estado: 'INCOMPLETO' | 'COMPLETO' | 'ARCHIVADO';
  gilId: string;
  cufeFuenteId?: string;
  actaId?: string;
  requisicionId?: string;
  registroAsistenciaAdjunto: boolean;
  instructorId: string;
  fecha: string;
}

export interface CrearPaqueteRequest {
  fichaId: string;
  gilId: string;
  instructorId: string;
  titulo?: string;
}

export interface TrazabilidadRequest {
  actaId?: string;
  requisicionId?: string;
  cufeFuenteId?: string;
}

export interface RequisicionItemResponse {
  codigo: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
}

export interface RequisicionResponse {
  id: string;
  numero: string;
  programa: string;
  fichaId: string;
  instructorId: string;
  instructorNombre: string;
  diaSemana: string;
  horaSesion: string;
  fecha: string;
  estado: 'BORRADOR' | 'ENVIADA' | 'DESPACHADA' | 'FIRMADA' | 'LEGALIZADA';
  items: RequisicionItemResponse[];
}

export interface CrearRequisicionRequest {
  programa: string;
  fichaId: string;
  instructorId: string;
  diaSemana: string;
  horaSesion: string;
  items: RequisicionItemResponse[];
}
