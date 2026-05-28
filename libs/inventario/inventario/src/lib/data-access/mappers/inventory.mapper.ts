import {
  Movimiento,
  EntradaMovimientoData,
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
  EntradaRequest,
  SalidaRequest,
  ReservaRequest,
  LiberacionRequest,
  AjusteRequest,
} from '../api/inventory.api';

/**
 * Normaliza la respuesta paginada de GET /inventory/movimientos/{productoId}.
 * El backend no documenta el schema en Swagger (type: object genérico) y puede
 * usar convención inglés (content/totalElements) o español (contenido/totalElementos).
 */
export function movimientoPageFromApi(resp: MovimientoPageResponse): {
  movimientos:    Movimiento[];
  totalPaginas:   number;
  totalElementos: number;
} {
  const dtos: MovimientoResponse[] =
    resp.content ?? resp.contenido ?? [];
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

export function entradaToRequest(data: EntradaMovimientoData): EntradaRequest {
  return {
    productoId:      data.productoId,
    cantidad:        data.cantidad,
    precioUnitario:  data.precioUnitario,
    facturaId:       data.facturaId,
    proveedorNit:    data.proveedorNit,
    gilId:           data.gilId,
    conciliacionId:  data.conciliacionId,
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
    productoId: data.producto,
    cantidadNueva: data.cantidadNueva,
    motivo: data.motivo,
    responsableId: data.responsableId,
  };
}
