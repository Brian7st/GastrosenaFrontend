/** Objeto LocalTime tal como lo espera el backend (Jackson sin ISO mode). */
export interface LocalTimeApi {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface ActaResponse {
  id:                    string;
  numeroActa:            number;
  comite?:               string;
  ciudad?:               string;
  fecha:                 string;
  horaInicio?:           string;
  horaFin?:              string;
  lugar?:                string;
  regional?:             string;
  fichaId:               string;
  instructorId:          string;
  requisicionId:         string;
  estado:                'BORRADOR' | 'PENDIENTE_FIRMAS' | 'FIRMADA' | 'REVISADA' | 'ARCHIVADA';
  resultadoAprendizaje?: string;
  actividadesRealizadas?: string;
  asistentes?:           AsistenteResponse[];
  compromisos?:          CompromisoActaResponse[];
}

export interface AsistenteRequest {
  nombre: string;
  dependenciaRol: string;
  aprueba: boolean;
}

export interface CompromisoRequest {
  actividad: string;
  fecha: string;       // ISO date
  responsable: string;
}

export interface CrearActaRequest {
  fecha: string;          // ISO date "yyyy-MM-dd"
  horaInicio: string;     // "HH:mm:ss" — Spring LocalTime con ISO mode
  horaFin: string;        // "HH:mm:ss" — Spring LocalTime con ISO mode
  requisicionId: string;
  instructorId: string;
  fichaId: string;
  resultadoAprendizaje: string;
  actividadesRealizadas: string;
  asistentes: AsistenteRequest[];
  compromisos: CompromisoRequest[];
}

/** Respuesta paginada del backend para GET /legalization/actas */
export interface ActasPageResponse {
  contenido: ActaResponse[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  tamano: number;
}

export interface PaqueteResponse {
  id: string;
  actaId: string;
  requisicionId: string;
  fichaId: string;
  instructorId: string;
  registroAsistenciaAdjunto: boolean;
  estado: 'INCOMPLETO' | 'COMPLETO' | 'REVISADO' | 'ARCHIVADO';
  cufeFuenteId?: string;
  gilId?: string;
  compromisoPresupuestalId?: string;
  titulo: string;
  expediente: string;
}

export interface PaquetesPageResponse {
  contenido: PaqueteResponse[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  tamano: number;
}

/** Alineado con CrearPaqueteHttpRequest del backend — solo estos 4 campos. */
export interface CrearPaqueteRequest {
  actaId: string;
  requisicionId: string;
  fichaId: string;
  instructorId: string;
}

export interface TrazabilidadRequest {
  cufeFuenteId: string;
  gilId: string;
  compromisoPresupuestalId: string;
}

/** Categorías de insumo — enum Swagger (B-04) */
export type CategoriaInsumo =
  | 'ABARROTES'
  | 'LACTEOS'
  | 'FRUTAS_Y_VEGETALES'
  | 'CARNES_PESCADOS_MARISCOS';

export interface AsistenteResponse {
  nombre:         string;
  dependenciaRol: string;
  aprueba:        boolean;
}

export interface CompromisoActaResponse {
  actividad:    string;
  fecha:        string;
  responsable:  string;
}

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
 *  DESPACHADA → habilitada para generar Salida de inventario (ecónomo aprobó físicamente).
 *  ENVIADA    → pendiente de despacho del ecónomo. */
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
  voceroId?:         string;
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
