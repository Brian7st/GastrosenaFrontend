import {
  Movimiento,
  DocumentoMovimiento,
  SalidaMovimientoData,
  ReservaMovimientoData,
  LiberacionMovimientoData,
  AjusteMovimientoData,
} from '../../models/movimiento.model';
import { ExistenciaProducto } from '../../models/inventario.model';
import {
  MovimientoResponse,
  MovimientoPageResponse,
  ExistenciaResponse,
  SalidaRequest,
  ReservaRequest,
  LiberacionRequest,
  AjusteRequest,
  DocumentoResponse,
  DocumentoPageResponse,
} from '../api/inventory.api';

/**
 * Normaliza la respuesta paginada de GET /inventory/movimientos/{productoId}.
 * El backend no documenta el schema en Swagger (type: object genérico).
 * La respuesta real expone el array bajo `movimientos` (KardexHttpResponse);
 * se mantienen los fallbacks inglés (content/totalElements) y español
 * (contenido/totalElementos) por compatibilidad.
 */
export function movimientoPageFromApi(resp: MovimientoPageResponse): {
  movimientos:    Movimiento[];
  totalPaginas:   number;
  totalElementos: number;
} {
  const dtos: MovimientoResponse[] =
    resp.movimientos ?? resp.content ?? resp.contenido ?? [];
  return {
    movimientos:    dtos.map(movimientoFromApi),
    totalPaginas:   resp.totalPages   ?? resp.totalPaginas   ?? 0,
    totalElementos: resp.totalElements ?? resp.totalElementos ?? 0,
  };
}

export function movimientoFromApi(dto: MovimientoResponse): Movimiento {
  return {
    id: dto.id,
    tipo: dto.tipo,
    productoNombre: dto.productoNombre,
    codigoSena: dto.codigoSena,
    cantidad: dto.cantidad,
    unidadMedida: dto.unidadMedida,
    fechaMovimiento: dto.fechaMovimiento,
    responsableNombre: dto.responsableNombre,
    valor: dto.valor,
    estado: dto.estado,
  };
}

export function documentoFromApi(dto: DocumentoResponse): DocumentoMovimiento {
  return {
    tipo: dto.tipo,
    documentoId: dto.documentoId,
    numeroDocumento: dto.numeroDocumento ?? dto.documentoId,
    cantidadBienes: dto.cantidadBienes,
    cantidadTotal: dto.cantidadTotal,
    valorTotal: dto.valorTotal,
    fecha: dto.fecha,
    estado: dto.estado,
  };
}

export function documentoPageFromApi(resp: DocumentoPageResponse): {
  documentos: DocumentoMovimiento[];
  totalPaginas: number;
  totalElementos: number;
  paginaActual: number;
  tamano: number;
} {
  const dtos = resp.documentos ?? [];
  return {
    documentos: dtos.map(documentoFromApi),
    totalPaginas: resp.totalPaginas ?? 0,
    totalElementos: resp.totalElementos ?? 0,
    paginaActual: resp.paginaActual ?? 0,
    tamano: resp.tamano ?? 0,
  };
}

export function existenciaFromApi(dto: ExistenciaResponse): ExistenciaProducto {
  return {
    productoId:    dto.productoId,
    stockFisico:   dto.stockFisico,
    stockReservado: dto.stockReservado,
    stockDisponible: dto.stockDisponible,
    stockMinimo:   dto.stockMinimo,
    bajoMinimo:    dto.bajoMinimo,
  };
}

export function salidaToRequest(data: SalidaMovimientoData): SalidaRequest {
  return {
    productoId:    data.productoId,
    cantidad:      data.cantidad,
    requisicionId: data.requisicionId,
    instructorId:  data.instructorId,
    categoria:     data.categoria,
  };
}

export function reservaToRequest(data: ReservaMovimientoData): ReservaRequest {
  return {
    productoId: data.producto,
    cantidad: data.cantidad,
    fichaId: data.fichaId,
    instructorId: data.instructorId,
    observaciones: data.observaciones,
  };
}

export function liberacionToRequest(data: LiberacionMovimientoData): LiberacionRequest {
  return {
    productoId: data.producto,
    cantidad: data.cantidad,
    motivo: data.motivo,
  };
}

export function ajusteToRequest(data: AjusteMovimientoData): AjusteRequest {
  return {
    productoId:    data.producto,
    cantidadNueva: data.cantidadNueva,
    motivo:        data.motivo,
    autorizado:    data.autorizado,
    referenciaId:  data.referenciaId ?? null,
  };
}
