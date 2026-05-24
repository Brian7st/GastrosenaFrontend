import { Rubro, Compromiso, PresupuestoDetalle, ResumenPresupuestosGlobal } from '../../models/presupuesto.model';
import { Consolidado } from '../../models/consolidado.model';
import {
  PresupuestoResponse,
  ConsolidadoResponse,
  CompromisoResponse,
  PresupuestoDetalleResponse,
  ResumenPresupuestosResponse,
} from '../api/budget.api';

export function rubroFromApi(dto: PresupuestoResponse): Rubro {
  return {
    id: dto.id,
    codigo: dto.codigo,
    descripcion: dto.descripcion,
    fichaId: dto.fichaId,
    programaFormacion: dto.programaFormacion,
    montoAsignado: dto.montoAsignado,
    saldoDisponible: dto.saldoDisponible,
    montoComprometido: dto.montoComprometido,
    montoPagado: dto.montoPagado,
    retencionZese: dto.retencionZese,
    porcentajeEjecucion: dto.porcentajeEjecucion,
  };
}

export function compromisoFromApi(dto: CompromisoResponse): Compromiso {
  return {
    id:                 dto.id,
    presupuestoId:      dto.presupuestoId,
    rubroId:            dto.rubroId,
    gilId:              dto.gilId,
    concepto:           dto.concepto,
    monto:              dto.monto,
    montoRetencionZese: dto.montoRetencionZese,
    fecha:              dto.fecha,
    estado:             dto.estado,
  };
}

export function presupuestoDetalleFromApi(dto: PresupuestoDetalleResponse): PresupuestoDetalle {
  return {
    id:                dto.id,
    fichaId:           dto.fichaId,
    programaFormacion: dto.programaFormacion,
    vigencia:          dto.vigencia,
    fechaAprobacion:   dto.fechaAprobacion,
    rubros: dto.rubros.map(r => ({
      id:                 r.id,
      codigo:             r.codigo,
      descripcion:        r.descripcion,
      fichaId:            dto.fichaId,
      programaFormacion:  dto.programaFormacion,
      montoAsignado:      r.montoAsignado,
      saldoDisponible:    r.saldoDisponible,
      montoComprometido:  r.montoComprometido,
      montoPagado:        r.montoPagado,
      retencionZese:      r.retencionZese,
      porcentajeEjecucion: r.porcentajeEjecucion,
    })),
  };
}

export function resumenPresupuestosFromApi(dto: ResumenPresupuestosResponse): ResumenPresupuestosGlobal {
  return {
    totalPresupuestos: dto.totalPresupuestos,
    vigencia:          dto.vigencia,
    totalAsignado:     dto.totalAsignado,
    totalComprometido: dto.totalComprometido,
    totalPagado:       dto.totalPagado,
    saldoGlobal:       dto.saldoGlobal,
    porcentajeEjecucion: dto.porcentajeEjecucion,
  };
}

export function consolidadoFromApi(dto: ConsolidadoResponse): Consolidado {
  return {
    id: dto.id,
    numero: dto.numero,
    fechaGeneracion: dto.fechaGeneracion,
    generadoPor: dto.generadoPor,
    estado: dto.estado,
    lineas: dto.lineas.map((l) => ({
      id: l.id,
      tipo: l.tipo,
      referencia: l.referencia,
      descripcion: l.descripcion,
      cantidad: l.cantidad,
      valor: l.valor,
    })),
    totales: {
      totalBienes: dto.totales.totalBienes,
      totalServicios: dto.totales.totalServicios,
      totalGeneral: dto.totales.totalGeneral,
    },
  };
}
