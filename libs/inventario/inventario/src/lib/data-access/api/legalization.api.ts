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
  actaId: string;
  requisicionId: string;
  fichaId: string;
  instructorId: string;
  titulo?: string;
}

export interface TrazabilidadRequest {
  actaId?: string;
  requisicionId?: string;
  cufeFuenteId?: string;
}

/** Categorías de insumo — enum Swagger (B-04) */
export type CategoriaInsumo =
  | 'ABARROTES'
  | 'LACTEOS'
  | 'FRUTAS_Y_VEGETALES'
  | 'CARNES_PESCADOS_MARISCOS';

/** RequisicionItemResponse — Swagger actualizado (B-02).
 *  productoId = codigoSena del catálogo; usar como productoId en RegistrarSalidaHttpRequest. */
export interface RequisicionItemResponse {
  productoId?:     string;
  productoNombre?: string;
  cantidad?:       number;
  unidadMedida?:   string;
  categoria?:      CategoriaInsumo;
}

/** RequisicionResponse — Swagger actualizado (B-02, B-04).
 *  ENVIADA   → habilitada para generar Salida de inventario.
 *  DESPACHADA → salida ya registrada. */
export interface RequisicionResponse {
  id?:               string;
  numero?:           string;
  fecha?:            string;
  diaSemana?:        string;
  horaSesion?:       string;
  fichaId?:          string;
  instructorId?:     string;
  instructorNombre?: string;
  estado?:           'BORRADOR' | 'ENVIADA' | 'DESPACHADA' | 'FIRMADA' | 'LEGALIZADA';
  items?:            RequisicionItemResponse[];
}

export interface CrearRequisicionRequest {
  programa: string;
  fichaId: string;
  instructorId: string;
  diaSemana: string;
  horaSesion: string;
  items: RequisicionItemResponse[];
}
