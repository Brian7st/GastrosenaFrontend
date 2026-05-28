/** DTOs de la capa procurement — alineados con el Swagger (GET /api/v1/procurement/giles).
 *  Solo lectura: el dominio inventario no crea ni modifica GILes. */

export interface CuentadanteResponse {
  nombre?: string;
  cedula?: string;
}

/** Ítem de un GIL — BienGilResponse (Swagger).
 *  productoId implementado en backend (B-01): usar directamente en RegistrarEntradaHttpRequest. */
export interface BienGilResponse {
  productoId?:    string;
  codigoSena?:    string;
  descripcion?:   string;
  unidadMedida?:  string;
  cantidad?:      number;
  valorUnitario?: number;
  subtotal?:      number;
}

/** GilResponse — estado: BORRADOR | EMITIDO | ENVIADO_PROVEEDOR | CERRADO */
export type EstadoGil = 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO';

export interface GilResponse {
  id?:                      string;
  numeroGil?:               string;
  estado?:                  EstadoGil;
  fechaSolicitud?:          string;
  regionalCodigo?:          number;
  regionalNombre?:          string;
  centroCostosCodigo?:      number;
  centroCostosNombre?:      string;
  area?:                    string;
  destinoBienes?:           string;
  jefeOficinaCoordinador?:  string;
  cuentadantes?:            CuentadanteResponse[];
  solicitante?:             string;
  codigoGrupo?:             string;
  fichaCaracterizacion?:    string;
  bienes?:                  BienGilResponse[];
  observaciones?:           string;
  creadoEn?:                string;
  actualizadoEn?:           string;
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
