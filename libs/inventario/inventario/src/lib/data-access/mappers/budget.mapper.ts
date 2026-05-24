import { Rubro } from '../../models/presupuesto.model';
import { Consolidado } from '../../models/consolidado.model';
import { PresupuestoResponse, ConsolidadoResponse } from '../api/budget.api';

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
