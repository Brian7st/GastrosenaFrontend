/** DTOs de la capa procurement — alineados con el Swagger (GET /api/v1/procurement/giles).
 *  Solo lectura: el dominio inventario no crea ni modifica GILes. */

export interface CuentadanteResponse {
  nombre?: string;
  cedula?: string;
}

/** Ítem de un GIL — BienGilResponse (Swagger).
 *  NOTA: el backend aún no expone productoId en este DTO (ver tarea B-01 backend).
 *  Se agrega como opcional para cuando el backend lo incorpore. */
export interface BienGilResponse {
  codigoSena?:    string;
  descripcion?:   string;
  unidadMedida?:  string;
  cantidad?:      number;
  valorUnitario?: number;
  subtotal?:      number;
  /** Pendiente backend B-01: agregar productoId a BienGilResponse */
  productoId?:    string;
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
