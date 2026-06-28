import {
  EjecucionPresupuestalItemResponse,
  KardexValorizadoItemResponse,
  ConsumoItemResponse,
  TrazabilidadDocumentalItemResponse,
  ResumenAlertasResponse,
  VencimientoResponse,
  EjecucionMensualResponse,
} from '../api/reporting.api';
import {
  EjecucionPresupuestal,
  KardexValorizadoItem,
  ConsumoItem,
  TrazabilidadDocumental,
  ResumenAlertas,
} from '../../models/reporting.model';
import { VencimientoProximo, EjecucionMensual, UrgenciaVencimiento } from '../../models/presupuesto.model';

const MES_LABELS: readonly string[] = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function urgenciaFromDias(dias: number): UrgenciaVencimiento {
  if (dias <= 3)  return 'critico';
  if (dias <= 15) return 'proximo';
  return 'normal';
}

function iconoFromDias(dias: number): string {
  if (dias <= 3)  return 'calendar-x';
  if (dias <= 15) return 'clock';
  return 'calendar';
}

export function vencimientoFromApi(dto: VencimientoResponse): VencimientoProximo {
  return {
    id:               dto.facturaId,
    titulo:           `${dto.numeroFactura} — ${dto.proveedor}`,
    diasRestantes:    dto.diasParaVencer,
    fechaVencimiento: dto.fechaVencimiento,
    icono:            iconoFromDias(dto.diasParaVencer),
    urgencia:         urgenciaFromDias(dto.diasParaVencer),
    cufe:             dto.cufe,
    proveedor:        dto.proveedor,
    gilId:            dto.gilId,
    montoTotal:       dto.montoTotal,
    estado:           dto.estado,
  };
}

/**
 * Maps a list of EjecucionMensualResponse → EjecucionMensual[].
 * Computes porcentaje relative to the month with the highest combined value.
 * esMesActual: true when anio+mes matches today's year+month.
 */
export function ejecucionMensualListFromApi(dtos: EjecucionMensualResponse[]): EjecucionMensual[] {
  const now = new Date();
  const currentAnio = now.getFullYear();
  const currentMes  = now.getMonth() + 1; // 1-based

  const mapped = dtos.map(dto => {
    const valor = dto.montoComprometido + dto.montoPagado;
    return {
      mes:               MES_LABELS[(dto.mes - 1) % 12] ?? String(dto.mes),
      anio:              dto.anio,
      mesNumero:         dto.mes,
      montoComprometido: dto.montoComprometido,
      montoPagado:       dto.montoPagado,
      valor,
      porcentaje:        0, // filled below
      esMesActual:       dto.anio === currentAnio && dto.mes === currentMes,
    };
  });

  const maxValor = mapped.reduce((m, x) => Math.max(m, x.valor), 0);
  return mapped.map(item => ({
    ...item,
    porcentaje: maxValor > 0 ? Math.round((item.valor / maxValor) * 100) : 0,
  }));
}

/**
 * Computa porcentajeEjecucion sin redondear: la precisión de visualización
 * se decide UNA sola vez en el template con el pipe `number`.
 */
function computePorcentajeEjecucion(
  montoAsignado: number,
  montoComprometido: number,
  montoPagado: number,
): number {
  if (montoAsignado <= 0) return 0;
  return (montoComprometido + montoPagado) / montoAsignado * 100;
}

export function ejecucionPresupuestalFromApi(
  dto: EjecucionPresupuestalItemResponse,
): EjecucionPresupuestal {
  return {
    presupuestoId:       dto.presupuestoId,
    fichaId:             dto.fichaId,
    programaFormacion:   dto.programaFormacion,
    vigencia:            dto.vigencia,
    rubroId:             dto.rubroId,
    rubroCodigo:         dto.rubroCodigo,
    rubroDescripcion:    dto.rubroDescripcion,
    montoAsignado:       dto.montoAsignado,
    montoComprometido:   dto.montoComprometido,
    montoPagado:         dto.montoPagado,
    saldoDisponible:     dto.saldoDisponible,
    porcentajeEjecucion: computePorcentajeEjecucion(
      dto.montoAsignado, dto.montoComprometido, dto.montoPagado,
    ),
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
  const porTipo = dto.porTipo ?? {};
  return {
    // Pendientes = sin resolver (activas + críticas); el backend no manda un total directo.
    totalAlertas:      (dto.totalActivas ?? 0) + (dto.totalCriticas ?? 0) + (dto.totalResueltas ?? 0),
    alertasPendientes: (dto.totalActivas ?? 0) + (dto.totalCriticas ?? 0),
    alertasResueltas:  dto.totalResueltas ?? 0,
    productosCriticos: dto.totalCriticas ?? 0,
    alertasPorTipo:    Object.entries(porTipo).map(([tipo, cantidad]) => ({ tipo, cantidad })),
    ultimaAlerta:      dto.ultimaAlerta,
  };
}
