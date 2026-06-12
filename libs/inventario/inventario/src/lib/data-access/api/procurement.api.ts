/** DTOs de la capa procurement — alineados con el Swagger (GET /api/v1/procurement/giles).
 *  Solo lectura: el dominio inventario no crea ni modifica GILes. */

/** Ítem de un GIL — BienGilResponse (Swagger).
 *  productoId implementado en backend (B-01): usar directamente en RegistrarEntradaHttpRequest. */
export interface BienGilResponse {
  productoId?:   string;
  codigoSena:    string;
  descripcion:   string;
  unidadMedida:  string;
  cantidad:      number;
  valorUnitario: number;
  subtotal:      number;
  iva:           number;
}

/** Cuentadante en responses de GIL — incluye id, nombre y cedula */
export interface CuentadanteGilResponse {
  id:     string;
  nombre: string;
  cedula: string;
}

/** GilResponse — estado: BORRADOR | EMITIDO | ENVIADO_PROVEEDOR | VERIFICADO | COMPROMETIDO | CERRADO */
export type EstadoGil = 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'VERIFICADO' | 'COMPROMETIDO' | 'CERRADO';

export interface GilResponse {
  id:                      string;
  numeroGil:               string;
  estado:                  EstadoGil;
  fechaSolicitud:          string;
  regionalCodigo:          number;
  regionalNombre:          string;
  centroCostosCodigo:      number;
  centroCostosNombre:      string;
  area:                    string;
  destinoBienes:           string;
  jefeOficinaCoordinador:  string;
  cuentadantes:            CuentadanteGilResponse[];
  solicitante:             string;
  codigoGrupo?:            string;
  bienes?:                 BienGilResponse[];
  observaciones?:          string;
  creadoEn?:               string;
  actualizadoEn?:          string;
  // Campos opcionales del módulo training
  programaId?:             string;
  emitidoPor?:             string;
  resultadoAprendizaje?:   string;
  actividades?:            string;
  voceroNombre?:           string;
  voceroDocumento?:        string;
  solicitudesOrigenIds?:   string[];
}

/** PagedGilResponse — GET /api/v1/procurement/giles */
export interface PagedGilResponse {
  content?:       GilResponse[];
  totalElements?: number;
  totalPages?:    number;
  /** Número de página actual (0-based) */
  number?:        number;
  size?:          number;
}
