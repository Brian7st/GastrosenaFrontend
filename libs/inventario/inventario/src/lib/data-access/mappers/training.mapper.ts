import { SolicitudSesionResponse } from '../api/training.api';
import { SolicitudSesion } from '../../models/solicitud-sesion.model';

/** Convierte el DTO de la API al modelo UI de SolicitudSesion */
export function solicitudSesionFromApi(dto: SolicitudSesionResponse): SolicitudSesion {
  return {
    id:                       dto.id,
    fechaSolicitud:           dto.fechaSolicitud,
    numeroSolicitud:          dto.numeroSolicitud,
    fichaId:                  dto.fichaId,
    programaId:               dto.programaId,
    instructorId:             dto.instructorId,
    identificacionInstructor: dto.identificacionInstructor,
    estado:                   dto.estado,
    valorTotalDeSolicitud:    dto.valorTotalDeSolicitud,
    items: dto.items.map(i => ({
      codigoSena:              i.codigoSena,
      nombreBien:              i.nombreBien,
      descripcion:             i.descripcion,
      cantidad:                i.cantidad,
      valorUnitarioAdjudicado: i.valorUnitarioAdjudicado,
      codigoAlmacen:           i.codigoAlmacen,
      unidadMedida:            i.unidadMedida,
      valorUnitario:           i.valorUnitario,
      total:                   i.total,
      iva:                     i.iva,
    })),
  };
}
