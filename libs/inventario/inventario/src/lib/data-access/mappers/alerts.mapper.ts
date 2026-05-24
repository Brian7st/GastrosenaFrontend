import { Alerta } from '../../models/alerta.model';
import { AlertaResponse, ResolverAlertaRequest } from '../api/alerts.api';

export function alertaFromApi(dto: AlertaResponse): Alerta {
  return {
    id: dto.id,
    tipo: dto.tipo,
    prioridad: dto.prioridad,
    referenciaId: dto.referenciaId,
    referenciaTipo: dto.referenciaTipo,
    descripcion: dto.descripcion,
    destinatarioId: dto.destinatarioId,
    destinatarioRol: dto.destinatarioRol,
    fechaGeneracion: dto.fechaGeneracion,
    estado: dto.estado,
    fechaResolucion: dto.fechaResolucion,
    accionResolucion: dto.accionResolucion,
    resueltoPorId: dto.resueltoPorId,
    codigoSena: dto.codigoSena,
    nombreBien: dto.nombreBien,
    stockActual: dto.stockActual,
    stockMinimo: dto.stockMinimo,
    unidad: dto.unidad,
  };
}

export function resolverAlertaToRequest(
  accion: string,
  usuarioId: string,
  observaciones?: string
): ResolverAlertaRequest {
  return { accionResolucion: accion, resueltoPorId: usuarioId, observaciones };
}
