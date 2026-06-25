// ─── Tipos que coinciden exactamente con los records Java del backend ─────────

/** GET /conciliaciones y GET /conciliaciones/{id} → mismo shape */
export interface ConciliacionBackendResponse {
  id:                   string;
  responsableId:        string;
  responsableNombre:    string;
  tipo:                 string;
  fecha:                string;
  estado:               string;
  totalItemsContados:   number;
  precision:            number;
  valorTotalDiferencias: number;
  diferencias:          DiferenciaBackendResponse[];
}

export interface DiferenciaBackendResponse {
  id:              string;
  codigoSena:      string;
  descripcion:     string;
  categoria:       string;
  unidad:          string;
  cantidadSistema: number;
  cantidadFisica:  number;
  valorUnitario:   number;
  valorMonetario:  number;
  estado:          string;
  justificacion:   string | null;
}

/** GET /conciliaciones/catalogo */
export interface CatalogoItemResponse {
  codigoSena:      string;
  descripcion:     string;
  categoria:       string;
  unidadMedida:    string;
  valorUnitario:   number;
  cantidadSistema: number;
}

// ─── Requests ────────────────────────────────────────────────────────────────

/** POST /conciliaciones */
export interface IniciarConciliacionRequest {
  responsableId:     string;
  responsableNombre: string;
  tipo:              'FISICA' | 'DOCUMENTAL';
  fecha:             string;
}

/** POST /conciliaciones/{id}/conteo */
export interface ConteoItemRequest {
  codigoSena:      string;
  descripcion:     string;
  cantidadSistema: number;
  cantidadFisica:  number;
  valorUnitario:   number;
}

export interface RegistrarConteoRequest {
  items: ConteoItemRequest[];
}

/** PATCH /conciliaciones/{id}/diferencias/{diferenciaId}/resolver */
export interface ResolverDiferenciaRequest {
  justificacion: string;
}
