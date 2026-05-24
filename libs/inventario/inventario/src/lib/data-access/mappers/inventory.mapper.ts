import { Movimiento, ExistenciaProducto, EntradaMovimientoData, SalidaMovimientoData } from '../../models/movimiento.model';
import { MovimientoResponse, ExistenciaResponse, EntradaRequest, SalidaRequest } from '../api/inventory.api';

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
    productoId: dto.productoId,
    codigoSena: dto.codigoSena,
    nombre: dto.nombre,
    categoria: dto.categoria,
    unidadMedida: dto.unidadMedida,
    stockDisponible: dto.stockDisponible,
    stockMinimo: dto.stockMinimo,
  };
}

export function entradaToRequest(data: EntradaMovimientoData): EntradaRequest {
  return {
    productoId: data.producto,
    cantidad: data.cantidad,
    fecha: data.fecha,
    proveedorId: data.proveedor,
    facturaId: data.factura,
    ubicacion: data.ubicacion,
    valorUnitario: data.valorUnitario,
    observaciones: data.observaciones,
  };
}

export function salidaToRequest(data: SalidaMovimientoData): SalidaRequest {
  return {
    productoId: data.producto,
    cantidad: data.cantidad,
    fecha: data.fecha,
    areaDestino: data.areaDestino,
    instructorId: data.instructor,
    fichaId: data.ficha,
    categoria: data.categoria,
    proposito: data.proposito,
    observaciones: data.observaciones,
  };
}
