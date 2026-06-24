import { ActaLegalizacion, AsistenteActa, CompromisoActa } from '../../models/acta.model';
import { PaqueteProbatorio } from '../../models/paquete.model';
import { Requisicion, RequisicionItem } from '../../models/requisicion.model';
import { ActaResponse, PaqueteResponse, RequisicionResponse } from '../api/legalization.api';

export function actaFromApi(dto: ActaResponse): ActaLegalizacion {
  return {
    id:                    dto.id,
    numeroActa:            String(dto.numeroActa),
    comite:                dto.comite,
    ciudad:                dto.ciudad,
    fecha:                 dto.fecha,
    horaInicio:            dto.horaInicio,
    horaFin:               dto.horaFin,
    lugar:                 dto.lugar,
    regional:              dto.regional,
    programa:              '',
    fichaId:               dto.fichaId,
    instructorId:          dto.instructorId,
    requisicionId:         dto.requisicionId,
    estado:                dto.estado,
    resultadoAprendizaje:  dto.resultadoAprendizaje,
    actividadesRealizadas: dto.actividadesRealizadas,
    asistentes: (dto.asistentes ?? []).map((a): AsistenteActa => ({
      nombre:         a.nombre,
      dependenciaRol: a.dependenciaRol,
      aprueba:        a.aprueba,
    })),
    compromisos: (dto.compromisos ?? []).map((c): CompromisoActa => ({
      actividad:   c.actividad,
      responsable: c.responsable,
      fechaLimite: c.fecha,
    })),
  };
}

export function paqueteFromApi(dto: PaqueteResponse): PaqueteProbatorio {
  return {
    id: dto.id,
    expediente: dto.expediente,
    titulo: dto.titulo,
    fichaId: dto.fichaId,
    estado: dto.estado,
    gilId: dto.gilId ?? '',
    cufeFuenteId: dto.cufeFuenteId,
    actaId: dto.actaId,
    requisicionId: dto.requisicionId,
    registroAsistenciaAdjunto: dto.registroAsistenciaAdjunto,
    instructorId: dto.instructorId,
    fecha: dto.fechaCreacion,
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
    voceroId:         dto.voceroId         ?? '',
    items: (dto.items ?? []).map((i): RequisicionItem => ({
      productoId:     i.productoId     ?? '',
      productoNombre: i.productoNombre ?? '',
      cantidad:       i.cantidad       ?? 0,
      unidadMedida:   i.unidadMedida   ?? '',
      categoria:      i.categoria      ?? 'ABARROTES',
    })),
  };
}
