/**
 * Estados posibles de una Factura Electrónica (FEL).
 */
export type EstadoFactura = 'REGISTRADA' | 'VERIFICADA' | 'PAGADA' | 'ANULADA';

/**
 * Monedas soportadas.
 */
export type MonedaFEL = 'COP' | 'GTQ' | 'USD';

/**
 * Ítem de detalle dentro de una factura.
 */
export interface FacturaItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  iva: number; // porcentaje, ej: 19
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
  items: FacturaItem[];
}

/**
 * Representa una Factura Electrónica (FEL).
 */
export interface Factura {
  id: string | number;
  numeroFEL: string;
  cufe: string;
  nitEmisor: string;
  nitReceptor: string;
  proveedor: string;
  razonSocial: string;
  tipoDocumento: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  moneda: MonedaFEL;
  estado: EstadoFactura;
  items: FacturaItem[];
  conciliacion?: ConciliacionItem[];
  subtotal: number;
  ivaTotal: number;
  total: number;
  ordenCompra?: string;
  gilVinculado?: string; // ID del formulario GIL-F-014 vinculado
  instructorCuentadante?: string;
  codigoCufe?: string; // 64 caracteres
  retencionZESE?: number; // porcentaje
  notasInternas?: string;
  archivosAdjuntos?: string[]; // nombres de archivos XML/PDF
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
 * DTO para crear o editar una factura.
 */
export interface FacturaFormDto {
  numeroFEL: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  nitEmisor: string;
  nitReceptor: string;
  gilVinculado?: string;
  instructorCuentadante?: string;
  codigoCufe?: string;
  retencionZESE?: number;
  ordenCompra?: string;
  archivosAdjuntos?: File[];
}

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
