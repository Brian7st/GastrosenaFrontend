import { Factura, FacturaFormDto, ConciliacionGil } from '../../models/facturas.model';
import { SolicitudGil, BienSolicitud, CuentadanteGil } from '../../models/solicitudes-gil.model';
import { FacturaResponse, GilResponse, RegistrarFacturaRequest, ConciliacionGilResponse } from '../api/sourcing.api';

export function facturaFromApi(dto: FacturaResponse): Factura {
  return {
    id: dto.id,
    numeroFactura: dto.numeroFactura,
    cufe: dto.cufe,
    proveedorNit: dto.proveedorNit,
    nitReceptor: dto.nitReceptor,
    proveedorNombre: dto.proveedorNombre,
    razonSocial: dto.razonSocial,
    tipoDocumento: dto.tipoDocumento,
    fechaEmision: dto.fechaEmision,
    fechaVencimiento: dto.fechaVencimiento,
    fechaRecepcion: dto.fechaRecepcion,
    estado: dto.estado,
    lineas: dto.lineas,
    subtotal: dto.subtotal,
    totalIva: dto.totalIva,
    total: dto.total,
    ordenCompra: dto.ordenCompra,
    gilVinculado: dto.gilVinculado,
    instructorId: dto.instructorId,
    valorRetencionZese: dto.valorRetencionZese,
    motivoAnulacion: dto.motivoAnulacion,
  };
}

export function facturaFormToRequest(form: FacturaFormDto): RegistrarFacturaRequest {
  return {
    numeroFactura: form.numeroFactura,
    cufe: '',
    proveedorNit: form.proveedorNit,
    nitReceptor: form.nitReceptor,
    fechaEmision: form.fechaEmision,
    fechaVencimiento: form.fechaVencimiento,
    fechaRecepcion: form.fechaRecepcion,
    lineas: [],
    ordenCompra: form.ordenCompra,
    gilVinculado: form.gilVinculado,
    instructorId: form.instructorId,
    valorRetencionZese: form.valorRetencionZese,
  };
}

export function conciliacionGilFromApi(dto: ConciliacionGilResponse): ConciliacionGil {
  return {
    id:        dto.id,
    facturaId: dto.facturaId,
    gilId:     dto.gilId,
    estado:    dto.estado,
    diferencias: dto.diferencias.map(d => ({
      gilItemId:             d.gilItemId,
      descripcion:           d.descripcion,
      cantidadGil:           d.cantidadGil,
      cantidadFactura:       d.cantidadFactura,
      precioUnitarioGil:     d.precioUnitarioGil,
      precioUnitarioFactura: d.precioUnitarioFactura,
      diferencia:            d.diferencia,
      observacion:           d.observacion,
      resuelta:              d.resuelta,
    })),
  };
}

export function gilFromApi(dto: GilResponse): SolicitudGil {
  return {
    id: dto.id,
    numeroGil: dto.numeroGil,
    fecha: dto.fecha,
    centroFormacionId: dto.centroFormacionId,
    area: dto.area,
    cuentadantes: dto.cuentadantes.map((c): CuentadanteGil => ({
      id: c.id,
      nombre: c.nombre,
      documento: c.documento,
    })),
    destino: dto.destino,
    fichaId: dto.fichaId,
    estado: dto.estado,
    programaId: dto.programaId,
    emitidoPor: dto.emitidoPor,
    resultadoAprendizaje: dto.resultadoAprendizaje,
    actividades: dto.actividades,
    voceroNombre: dto.voceroNombre,
    voceroDocumento: dto.voceroDocumento,
    solicitudesOrigenIds: dto.solicitudesOrigenIds,
    observaciones: dto.observaciones,
    bienes: dto.bienes?.map((b): BienSolicitud => ({
      codigo: b.codigo,
      descripcion: b.descripcion,
      um: b.um,
      cantidad: b.cantidad,
      valorUnitario: b.valorUnitario,
      subtotal: b.subtotal,
    })),
  };
}
