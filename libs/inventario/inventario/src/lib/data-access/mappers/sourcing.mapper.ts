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

/**
 * Transforma el response del backend (GilResponse) al modelo interno (SolicitudGil).
 * NOTA: los nombres de campo del response están alineados con los del request
 * (fechaSolicitud, destinoBienes, fichaCaracterizacion, etc.).
 * Revisar si el backend devuelve nombres distintos una vez que documente GilResponse
 * (tarea BACKEND #2).
 */
export function gilFromApi(dto: GilResponse): SolicitudGil {
  return {
    id:                   dto.id,
    numeroGil:            dto.numeroGil,
    fechaSolicitud:       dto.fechaSolicitud,
    regionalCodigo:       dto.regionalCodigo,
    regionalNombre:       dto.regionalNombre,
    centroCostosCodigo:   dto.centroCostosCodigo,
    centroCostosNombre:   dto.centroCostosNombre,
    area:                 dto.area,
    destinoBienes:        dto.destinoBienes,
    jefeOficinaCoordinador: dto.jefeOficinaCoordinador,
    solicitante:          dto.solicitante,
    codigoGrupo:          dto.codigoGrupo,
    fichaCaracterizacion: dto.fichaCaracterizacion,
    estado:               dto.estado,
    observaciones:        dto.observaciones,
    cuentadantes: dto.cuentadantes.map((c): CuentadanteGil => ({
      id:     c.id,
      nombre: c.nombre,
      cedula: c.cedula,
    })),
    bienes: dto.bienes?.map((b): BienSolicitud => ({
      codigoSena:    b.codigoSena,
      descripcion:   b.descripcion,
      unidadMedida:  b.unidadMedida,
      cantidad:      b.cantidad,
      valorUnitario: b.valorUnitario,
      subtotal:      b.subtotal,
    })),
    // Campos opcionales del módulo training
    programaId:          dto.programaId,
    emitidoPor:          dto.emitidoPor,
    resultadoAprendizaje: dto.resultadoAprendizaje,
    actividades:         dto.actividades,
    voceroNombre:        dto.voceroNombre,
    voceroDocumento:     dto.voceroDocumento,
    solicitudesOrigenIds: dto.solicitudesOrigenIds,
  };
}
