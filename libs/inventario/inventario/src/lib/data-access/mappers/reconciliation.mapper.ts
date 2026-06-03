import {
  ConciliacionRegistro,
  ConciliacionDetalle,
  DiferenciaItem,
  TomaFisicaItem,
} from '../../models/conciliacion.model';
import {
  ConciliacionBackendResponse,
  DiferenciaBackendResponse,
  CatalogoItemResponse,
} from '../api/reconciliation.api';

export function conciliacionListItemFromApi(dto: ConciliacionBackendResponse): ConciliacionRegistro {
  const estadoColorMap: Record<string, ConciliacionRegistro['estadoColor']> = {
    COMPLETADA:      'success',
    EN_PROCESO:      'info',
    CON_DIFERENCIAS: 'error',
  };
  return {
    id:          dto.id,
    fecha:       dto.fecha,
    ubicacion:   dto.responsableNombre,
    itemsTotal:  dto.totalItemsContados,
    itemsDif:    dto.diferencias.length,
    precision:   dto.precision,
    estado:      dto.estado,
    estadoColor: estadoColorMap[dto.estado] ?? 'info',
  };
}

export function conciliacionDetailFromApi(dto: ConciliacionBackendResponse): ConciliacionDetalle {
  return {
    id:                    dto.id,
    fecha:                 dto.fecha,
    responsable:           dto.responsableNombre,
    estado:                dto.estado,
    totalItemsContados:    dto.totalItemsContados,
    diferencias:           dto.diferencias.length,
    precision:             dto.precision,
    valorTotalDiferencias: dto.valorTotalDiferencias,
  };
}

export function diferenciaFromApi(dto: DiferenciaBackendResponse): DiferenciaItem {
  const diferencia = dto.cantidadSistema - dto.cantidadFisica;
  return {
    id:          dto.id,
    producto:    dto.descripcion,
    codigo:      dto.codigoSena,
    categoria:   '',
    stockSistema: dto.cantidadSistema,
    stockFisico:  dto.cantidadFisica,
    diferencia,
    unidad:      '',
    valorUnit:   dto.valorUnitario,
    impacto:     dto.valorMonetario,
    estado:      dto.estado,
    justificacion: dto.justificacion ?? null,
  };
}

export function catalogoItemToTomaFisicaItem(dto: CatalogoItemResponse): TomaFisicaItem {
  return {
    id:           dto.codigoSena,
    codigoSena:   dto.codigoSena,
    categoria:    dto.categoria ?? '',
    producto:     dto.descripcion,
    stockSistema: dto.cantidadSistema,
    conteoFisico: null,
    valorUnitario: dto.valorUnitario,
  };
}
