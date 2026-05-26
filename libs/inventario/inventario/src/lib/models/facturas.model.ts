/**
 * Estados posibles de una Factura Electrónica.
 */
export type EstadoFactura = 'REGISTRADA' | 'VERIFICADA' | 'PAGADA' | 'ANULADA';

/**
 * Línea de detalle dentro de una factura.
 */
export interface FacturaLinea {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  iva: number;
  total: number;
}

/**
 * Ítem de conciliación GIL vs Factura.
 */
export interface ConciliacionItem {
  descripcion: string;
  cantidadGil: number;
  cantidadFactura: number;
  diferenciaCantidad: number;
  precioGil: number;
  precioFactura: number;
  diferenciaPrecio: number;
}

/**
 * Pre-factura vinculada a una solicitud GIL.
 */
export interface PreFactura {
  id: string;
  proveedor: string;
  subtotal: number;
  items: FacturaLinea[];
}

/**
 * Representa una Factura Electrónica.
 */
export interface Factura {
  id: string | number;
  numeroFactura: string;
  cufe: string;
  proveedorNit: string;
  nitReceptor: string;
  proveedorNombre: string;
  razonSocial: string;
  tipoDocumento: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  fechaRecepcion?: string;
  estado: EstadoFactura;
  lineas: FacturaLinea[];
  conciliacion?: ConciliacionItem[];
  subtotal: number;
  totalIva: number;
  total: number;
  ordenCompra?: string;
  gilVinculado?: string;
  instructorId?: string;
  valorRetencionZese?: number;
  motivoAnulacion?: string;
  proveedorBeneficiarioZese?: string;
}

/**
 * KPIs del panel de facturación.
 */
export interface FacturaKpis {
  totalFacturas: number;
  tendenciaTotalFacturas: number;
  montoMensual: number;
  tendenciaMonto: number;
  registradas: number;
  verificadas: number;
  pagadas: number;
  anuladas: number;
}

/**
 * Filtros para el listado de facturas.
 */
export interface FacturaFiltros {
  busqueda?: string;
  estado?: EstadoFactura;
  proveedor?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

/**
 * DTO para crear o editar una factura (POST/PUT /facturas).
 */
export interface FacturaFormDto {
  numeroFactura: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  fechaRecepcion?: string;
  proveedorNit: string;
  nitReceptor: string;
  gilVinculado?: string;
  instructorId?: string;
  valorRetencionZese?: number;
  ordenCompra?: string;
  motivoAnulacion?: string;
}

// ─── Conciliación Factura-GIL ───────────────────────────────────────────────

export interface ConciliacionGilDiferencia {
  gilItemId:             string;
  descripcion:           string;
  cantidadGil:           number;
  cantidadFactura:       number;
  precioUnitarioGil:     number;
  precioUnitarioFactura: number;
  diferencia:            number;
  observacion?:          string;
  resuelta:              boolean;
}

export interface ConciliacionGil {
  id:          string;
  facturaId:   string;
  gilId:       string;
  estado:      string;
  diferencias: ConciliacionGilDiferencia[];
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Estado de la solicitud GIL F-014.
 */
export type EstadoGIL = 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO';

/**
 * Solicitud GIL F-014 completa con trazabilidad.
 */
export interface SolicitudGIL {
  id: string;
  nombreVocero: string;
  horarios: string;
  resultadoAprendizaje: string;
  estadoSolicitud: EstadoGIL;
  fechaCreacion: string;
  totalEstimado: number;
  responsable: string;
  avatarResponsable?: string;
  regional: string;
  centroFormacion: string;
  areaPrograma: string;
  cuentadanteResponsable: string;
  destinoBien: string;
  preFacturas: PreFactura[];
  observaciones: string;
  comentarios?: string[];
  hashTransaccion: string;
  idTransaccion: string;
}
