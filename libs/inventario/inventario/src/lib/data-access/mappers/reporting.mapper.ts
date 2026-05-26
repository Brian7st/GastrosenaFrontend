import {
  EjecucionPresupuestalItemResponse,
  KardexValorizadoItemResponse,
  ConsumoItemResponse,
  TrazabilidadDocumentalItemResponse,
  ResumenAlertasResponse,
} from '../api/reporting.api';
import {
  EjecucionPresupuestal,
  KardexValorizadoItem,
  ConsumoItem,
  TrazabilidadDocumental,
  ResumenAlertas,
} from '../../models/reporting.model';

export function ejecucionPresupuestalFromApi(
  dto: EjecucionPresupuestalItemResponse,
): EjecucionPresupuestal {
  return {
    fichaId:             dto.fichaId,
    programaFormacion:   dto.programaFormacion,
    vigencia:            dto.vigencia,
    totalPresupuestado:  dto.totalPresupuestado,
    totalComprometido:   dto.totalComprometido,
    totalPagado:         dto.totalPagado,
    porcentajeEjecucion: dto.porcentajeEjecucion,
    saldoDisponible:     dto.saldoDisponible,
  };
}

export function kardexValorizadoFromApi(dto: KardexValorizadoItemResponse): KardexValorizadoItem {
  return {
    fecha:           dto.fecha,
    tipo:            dto.tipo,
    productoId:      dto.productoId,
    productoNombre:  dto.productoNombre,
    cantidad:        dto.cantidad,
    precioUnitario:  dto.precioUnitario,
    valorTotal:      dto.valorTotal,
    saldoUnidades:   dto.saldoUnidades,
    saldoValorizado: dto.saldoValorizado,
  };
}

export function consumoFromApi(dto: ConsumoItemResponse): ConsumoItem {
  return {
    instructorId:      dto.instructorId,
    instructorNombre:  dto.instructorNombre,
    fichaId:           dto.fichaId,
    programaFormacion: dto.programaFormacion,
    productoId:        dto.productoId,
    productoNombre:    dto.productoNombre,
    cantidadConsumida: dto.cantidadConsumida,
    valorTotal:        dto.valorTotal,
    fecha:             dto.fecha,
  };
}

export function trazabilidadFromApi(
  dto: TrazabilidadDocumentalItemResponse,
): TrazabilidadDocumental {
  return {
    fichaId:           dto.fichaId,
    programaFormacion: dto.programaFormacion,
    instructorId:      dto.instructorId,
    instructorNombre:  dto.instructorNombre,
    requisicionId:     dto.requisicionId,
    actaId:            dto.actaId,
    paqueteId:         dto.paqueteId,
    gilId:             dto.gilId,
    facturaId:         dto.facturaId,
    estado:            dto.estado,
    fecha:             dto.fecha,
  };
}

export function resumenAlertasFromApi(dto: ResumenAlertasResponse): ResumenAlertas {
  return {
    totalAlertas:      dto.totalAlertas,
    alertasPendientes: dto.alertasPendientes,
    alertasResueltas:  dto.alertasResueltas,
    productosCriticos: dto.productosCriticos,
    alertasPorTipo:    dto.alertasPorTipo.map(a => ({ tipo: a.tipo, cantidad: a.cantidad })),
    ultimaAlerta:      dto.ultimaAlerta,
  };
}
