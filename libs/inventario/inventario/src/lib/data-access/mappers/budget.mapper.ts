import { Rubro, Compromiso, PresupuestoDetalle, ResumenPresupuestosGlobal, AfectacionPresupuestal } from '../../models/presupuesto.model';
import { Consolidado, ElegibleConsolidado } from '../../models/consolidado.model';
import {
  PresupuestoResponse,
  ConsolidadoResponse,
  CompromisoResponse,
  RubroResponse,
  ResumenPresupuestosResponse,
  ElegibleConsolidadoResponse,
} from '../api/budget.api';

/** Computa porcentajeEjecucion: guard divide-by-zero. */
function computePorcentajeEjecucion(
  montoAsignado: number,
  montoComprometido: number,
  montoPagado: number,
): number {
  if (montoAsignado <= 0) return 0;
  return parseFloat(((montoComprometido + montoPagado) / montoAsignado * 100).toFixed(2));
}

/** Mapea RubroResponse + contexto del presupuesto padre → Rubro del modelo. */
export function rubroFromApi(
  dto: RubroResponse,
  fichaId: string,
  programaFormacion: string,
): Rubro {
  return {
    id:                 dto.id,
    codigo:             dto.codigo,
    descripcion:        dto.descripcion,
    fichaId,
    programaFormacion,
    posicionPresupuestal: dto.posicionPresupuestal,
    dependencia:          dto.dependencia,
    fuente:               dto.fuente,
    valorPorCancelar:     dto.valorPorCancelar,
    montoAsignado:      dto.montoAsignado,
    saldoDisponible:    dto.saldoDisponible,
    montoComprometido:  dto.montoComprometido,
    montoPagado:        dto.montoPagado,
    // retencionZese: ZESE no existe en el backend — se mantiene a 0 para compatibilidad UI
    retencionZese:      0,
    porcentajeEjecucion: computePorcentajeEjecucion(
      dto.montoAsignado, dto.montoComprometido, dto.montoPagado,
    ),
  };
}

/** Aplana la lista paginada de presupuestos → array plano de Rubros. */
export function rubrosFromPresupuestoList(presupuestos: PresupuestoResponse[]): Rubro[] {
  return presupuestos.flatMap(p =>
    p.rubros.map(r => rubroFromApi(r, p.fichaId, p.programaFormacion)),
  );
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

export function presupuestoDetalleFromApi(dto: PresupuestoResponse): PresupuestoDetalle {
  return {
    id:                dto.id,
    fichaId:           dto.fichaId,
    programaFormacion: dto.programaFormacion,
    vigencia:          dto.vigencia,
    fechaAprobacion:   dto.fechaAprobacion,
    rubros: dto.rubros.map(r => rubroFromApi(r, dto.fichaId, dto.programaFormacion)),
  };
}

export function resumenPresupuestosFromApi(dto: ResumenPresupuestosResponse): ResumenPresupuestosGlobal {
  return {
    totalPresupuestos:   dto.totalPresupuestos,
    vigencia:            dto.vigencia,
    totalAsignado:       dto.totalAsignado,
    totalComprometido:   dto.totalComprometido,
    totalPagado:         dto.totalPagado,
    saldoGlobal:         dto.saldoGlobal,
    porcentajeEjecucion: dto.porcentajeEjecucion,
  };
}

export function afectacionFromCompromiso(dto: CompromisoResponse): AfectacionPresupuestal {
  return {
    id:                 dto.id,
    rubroId:            dto.rubroId,
    gilId:              dto.gilId,
    concepto:           dto.concepto,
    monto:              dto.monto,
    montoRetencionZese: dto.montoRetencionZese,
    fecha:              dto.fecha,
    estado:             dto.estado,
  };
}

export function elegibleFromApi(dto: ElegibleConsolidadoResponse): ElegibleConsolidado {
  return {
    compromisoId:  dto.compromisoId,
    gilId:         dto.gilId,
    facturaId:     dto.facturaId,
    concepto:      dto.concepto,
    fecha:         dto.fecha,
    numeroFactura: dto.numeroFactura,
    cufe:          dto.cufe,
    monto:         dto.monto,
    retencionZese: dto.retencionZese,
    selected:      false,
  };
}

export function consolidadoFromApi(dto: ConsolidadoResponse): Consolidado {
  return {
    id:              dto.id,
    numero:          dto.numero,
    fechaGeneracion: dto.fechaGeneracion,
    generadoPor:     dto.generadoPor,
    estado:          dto.estado,
    lineas: dto.lineas.map(l => ({
      gilId:         l.gilId,
      compromisoId:  l.compromisoId,
      facturaId:     l.facturaId,
      concepto:      l.concepto,
      fecha:         l.fecha,
      numeroFactura: l.numeroFactura,
      cufe:          l.cufe,
      monto:         l.monto,
      retencionZese: l.retencionZese,
    })),
    totales: {
      sumaMontos:        dto.totales.sumaMontos,
      sumaRetencionZese: dto.totales.sumaRetencionZese,
      valorNeto:         dto.totales.valorNeto,
    },
  };
}
