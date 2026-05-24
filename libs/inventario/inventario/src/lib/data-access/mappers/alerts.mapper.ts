import { Alerta, UmbralConfig } from '../../models/alerta.model';
import { AlertaResponse, ResolverAlertaRequest, UmbralStockResponse } from '../api/alerts.api';

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

/** GET /alerts/alertas/umbrales → UmbralConfig
 *  Los campos de UI (bien, categoria, icono, emailActivo, correos) no existen
 *  en el response del backend; se rellenan con defaults hasta que se enriquezcan. */
export function umbralFromApi(dto: UmbralStockResponse): UmbralConfig {
  return {
    id:           dto.productoId,
    bien:         dto.productoId, // TODO: enriquecer con nombre desde /catalog/productos/{id}
    categoria:    '',
    icono:        'inventory',
    stockMinimo:  dto.stockMinimo,
    emailActivo:  false,
    correos:      '',
    enAlerta:     dto.bajoMinimo,
  };
}
