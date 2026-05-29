import { ConciliacionRegistro, ConciliacionDetalle, DiferenciaItem } from '../../models/conciliacion.model';
import {
  ConciliacionListItemResponse,
  ConciliacionDetailResponse,
  DiferenciaResponse,
} from '../api/reconciliation.api';

export function conciliacionListItemFromApi(dto: ConciliacionListItemResponse): ConciliacionRegistro {
  const estadoColorMap: Record<string, ConciliacionRegistro['estadoColor']> = {
    CERRADA: 'success',
    EN_PROCESO: 'info',
    PENDIENTE: 'warning',
    CON_DIFERENCIAS: 'error',
  };
  return {
    id: dto.id,
    fecha: dto.fecha,
    ubicacion: dto.ubicacion,
    itemsTotal: dto.itemsTotal,
    itemsDif: dto.itemsDif,
    precision: dto.precision,
    estado: dto.estado,
    estadoColor: estadoColorMap[dto.estado] ?? 'info',
  };
}

export function conciliacionDetailFromApi(dto: ConciliacionDetailResponse): ConciliacionDetalle {
  return {
    id: dto.id,
    fecha: dto.fecha,
    responsable: dto.responsable,
    estado: dto.estado,
    totalItemsContados: dto.totalItemsContados,
    diferencias: dto.diferencias,
    precision: dto.precision,
    valorTotalDiferencias: dto.valorTotalDiferencias,
  };
}

export function diferenciaFromApi(dto: DiferenciaResponse): DiferenciaItem {
  return {
    producto: dto.producto,
    codigo: dto.codigo,
    categoria: dto.categoria,
    stockSistema: dto.stockSistema,
    stockFisico: dto.stockFisico,
    diferencia: dto.diferencia,
    unidad: dto.unidad,
    valorUnit: dto.valorUnit,
    impacto: dto.impacto,
  };
}
