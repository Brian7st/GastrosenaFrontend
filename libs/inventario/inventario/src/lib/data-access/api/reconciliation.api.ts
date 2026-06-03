export interface ConciliacionListItemResponse {
  id: string;
  fecha: string;
  ubicacion: string;
  itemsTotal: number;
  itemsDif: number;
  precision: number;
  estado: string;
}

export interface ConciliacionDetailResponse {
  id: string;
  fecha: string;
  responsable: string;
  estado: string;
  totalItemsContados: number;
  diferencias: number;
  precision: number;
  valorTotalDiferencias: number;
}

export interface DiferenciaResponse {
  id: string;
  producto: string;
  codigo: string;
  categoria: string;
  stockSistema: number;
  stockFisico: number;
  diferencia: number;
  unidad: string;
  valorUnit: number;
  impacto: number;
}

/** POST /reconciliation/conciliaciones — inicia una nueva conciliación */
export interface IniciarConciliacionRequest {
  responsableId: string;
  responsableNombre: string;
  tipo: 'FISICA' | 'DOCUMENTAL';
  fecha: string;
}

/** Ítem de conteo físico (POST /reconciliation/conciliaciones/{id}/conteo) */
export interface ConteoItemRequest {
  codigoSena: string;
  descripcion: string;
  cantidadSistema: number;
  cantidadFisica: number;
  valorUnitario: number;
}

/** Body de POST /reconciliation/conciliaciones/{id}/conteo */
export interface RegistrarConteoRequest {
  items: ConteoItemRequest[];
}

/** PATCH /reconciliation/conciliaciones/{id}/diferencias/{diferenciaId}/resolver */
export interface ResolverDiferenciaRequest {
  justificacion: string;
}

/** GET /reconciliation/conciliaciones/catalogo — ítem del catálogo con stock actual */
export interface CatalogoItemResponse {
  codigoSena:      string;
  descripcion:     string;
  categoria:       string;
  unidadMedida:    string;
  valorUnitario:   number;
  cantidadSistema: number;
}
