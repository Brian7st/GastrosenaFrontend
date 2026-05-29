import { ActaLegalizacion } from '../../models/acta.model';
import { PaqueteProbatorio } from '../../models/paquete.model';
import { Requisicion, RequisicionItem } from '../../models/requisicion.model';
import { ActaResponse, PaqueteResponse, RequisicionResponse } from '../api/legalization.api';

export function actaFromApi(dto: ActaResponse): ActaLegalizacion {
  return {
    id: dto.id,
    numeroActa: dto.numeroActa,
    fecha: dto.fecha,
    programa: dto.programa,
    fichaId: dto.fichaId,
    instructorId: dto.instructorId,
    requisicionId: dto.requisicionId,
    estado: dto.estado,
    ciudad: dto.ciudad,
    lugar: dto.lugar,
    agendaSesion: dto.agendaSesion,
    desarrolloSesion: dto.desarrolloSesion,
    resultadoAprendizaje: dto.resultadoAprendizaje,
    actividadesEjecutadas: dto.actividadesEjecutadas,
  };
}

export function paqueteFromApi(dto: PaqueteResponse): PaqueteProbatorio {
  return {
    id: dto.id,
    expediente: dto.expediente,
    titulo: dto.titulo,
    fichaId: dto.fichaId,
    estado: dto.estado,
    gilId: dto.gilId,
    cufeFuenteId: dto.cufeFuenteId,
    actaId: dto.actaId,
    requisicionId: dto.requisicionId,
    registroAsistenciaAdjunto: dto.registroAsistenciaAdjunto,
    instructorId: dto.instructorId,
    fecha: dto.fecha,
  };
}

export function requisicionFromApi(dto: RequisicionResponse): Requisicion {
  return {
    id:               dto.id               ?? '',
    numero:           dto.numero           ?? '',
    programa:         '',
    fichaId:          dto.fichaId          ?? '',
    instructorId:     dto.instructorId     ?? '',
    instructorNombre: dto.instructorNombre ?? '',
    diaSemana:        dto.diaSemana        ?? '',
    horaSesion:       dto.horaSesion       ?? '',
    fecha:            dto.fecha            ?? '',
    estado:           dto.estado           ?? 'BORRADOR',
    items: (dto.items ?? []).map((i): RequisicionItem => ({
      productoId:     i.productoId     ?? '',
      productoNombre: i.productoNombre ?? '',
      cantidad:       i.cantidad       ?? 0,
      unidadMedida:   i.unidadMedida   ?? '',
      categoria:      i.categoria      ?? 'ABARROTES',
    })),
  };
}
