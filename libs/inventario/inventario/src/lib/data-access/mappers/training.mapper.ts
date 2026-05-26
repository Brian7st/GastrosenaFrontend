import { SolicitudSesionResponse } from '../api/training.api';
import { SolicitudSesion } from '../../models/solicitud-sesion.model';

/** Convierte el DTO de la API al modelo UI de SolicitudSesion */
export function solicitudSesionFromApi(dto: SolicitudSesionResponse): SolicitudSesion {
  return {
    id:                   dto.id,
    fichaId:              dto.fichaId,
    programaId:           dto.programaId,
    instructorId:         dto.instructorId,
    resultadoAprendizaje: dto.resultadoAprendizaje,
    actividades:          dto.actividades,
    voceroId:             dto.voceroId,
    estado:               dto.estado,
    items: dto.items.map(i => ({
      productoId:    i.productoId,
      cantidad:      i.cantidad,
      unidadMedida:  i.unidadMedida,
      justificacion: i.justificacion,
    })),
  };
}
