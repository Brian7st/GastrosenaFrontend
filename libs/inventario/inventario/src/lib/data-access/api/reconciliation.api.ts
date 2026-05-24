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

export interface ConteoItemRequest {
  productoId: string;
  conteoFisico: number;
}

export interface IniciarConteoRequest {
  items: ConteoItemRequest[];
}

export interface ResolverDiferenciaRequest {
  ajuste: 'SISTEMA' | 'FISICO';
  motivo: string;
}
