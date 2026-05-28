import { Factura, FacturaFormDto, ConciliacionGil } from '../../models/facturas.model';
import { SolicitudGil, BienSolicitud, CuentadanteGil } from '../../models/solicitudes-gil.model';
import { BackendDateArray, FacturaLineaResponse, FacturaResponse, GilResponse, RegistrarFacturaRequest, ConciliacionGilResponse } from '../api/sourcing.api';

function backendDateToIso(date: BackendDateArray | string | undefined | null): string {
  if (!date) return '';
  if (typeof date === 'string') return date;
  const [year, month, day] = date;
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function facturaLineaFromApi(dto: FacturaLineaResponse) {
  const iva = dto.porcentajeIva ?? dto.iva ?? 0;
  return {
    productoId: dto.productoId,
    descripcion: dto.descripcion,
    cantidad: dto.cantidad,
    precioUnitario: dto.precioUnitario,
    porcentajeIva: iva,
    iva,
    subtotal: dto.subtotal,
    valorIva: dto.valorIva,
    total: dto.total,
  };
}

export function facturaFromApi(dto: FacturaResponse): Factura {
  return {
    id: dto.id,
    numeroFactura: dto.numeroFactura,
    cufe: dto.cufe,
    proveedorNit: dto.proveedorNit,
    proveedorNombre: dto.proveedorNombre,
    fechaEmision: backendDateToIso(dto.fechaEmision),
    fechaRecepcion: backendDateToIso(dto.fechaRecepcion),
    estado: dto.estado,
    lineas: dto.lineas.map(facturaLineaFromApi),
    subtotal: dto.subtotal,
    totalIva: dto.totalIva,
    total: dto.total,
    ordenCompra: dto.ordenCompra,
    instructorId: dto.instructorId,
    valorRetencionZese: dto.valorRetencionZese,
    motivoAnulacion: dto.motivoAnulacion ?? undefined,
    proveedorBeneficiarioZese: dto.proveedorBeneficiarioZese,
    infoBancariaBanco: dto.infoBancariaBanco ?? undefined,
    infoBancariaCuenta: dto.infoBancariaCuenta ?? undefined,
    infoBancariaTipo: dto.infoBancariaTipo ?? undefined,
  };
}

export function facturaFormToRequest(form: FacturaFormDto): RegistrarFacturaRequest {
  return {
    numeroFactura: form.numeroFactura,
    cufe: form.cufe,
    proveedorNit: form.proveedorNit,
    proveedorNombre: form.proveedorNombre,
    proveedorBeneficiarioZese: form.proveedorBeneficiarioZese,
    fechaEmision: form.fechaEmision,
    fechaRecepcion: form.fechaRecepcion,
    infoBancariaBanco: form.infoBancariaBanco,
    infoBancariaCuenta: form.infoBancariaCuenta,
    infoBancariaTipo: form.infoBancariaTipo,
    lineas: form.lineas.map(linea => ({
      productoId: linea.productoId || undefined,
      descripcion: linea.descripcion,
      cantidad: linea.cantidad,
      precioUnitario: linea.precioUnitario,
      porcentajeIva: linea.porcentajeIva,
    })),
    ordenCompra: form.ordenCompra,
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
    creadoEn:      dto.creadoEn,
    actualizadoEn: dto.actualizadoEn,
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
