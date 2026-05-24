export interface FacturaLineaResponse {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  iva: number;
  total: number;
}

export interface FacturaResponse {
  id: string;
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
  estado: 'REGISTRADA' | 'VERIFICADA' | 'PAGADA' | 'ANULADA';
  lineas: FacturaLineaResponse[];
  subtotal: number;
  totalIva: number;
  total: number;
  ordenCompra?: string;
  gilVinculado?: string;
  instructorId?: string;
  valorRetencionZese?: number;
  motivoAnulacion?: string;
}

export interface FacturaResumenResponse {
  totalFacturas: number;
  tendenciaTotalFacturas: number;
  montoMensual: number;
  tendenciaMonto: number;
  registradas: number;
  verificadas: number;
  pagadas: number;
  anuladas: number;
}

export interface RegistrarFacturaRequest {
  numeroFactura: string;
  cufe: string;
  proveedorNit: string;
  nitReceptor: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  fechaRecepcion?: string;
  lineas: Pick<FacturaLineaResponse, 'descripcion' | 'cantidad' | 'precioUnitario' | 'iva'>[];
  ordenCompra?: string;
  gilVinculado?: string;
  instructorId?: string;
  valorRetencionZese?: number;
}

export type ActualizarFacturaRequest = Partial<RegistrarFacturaRequest>;

export interface AnularFacturaRequest {
  motivoAnulacion: string;
}

export interface InfoBancariaRequest {
  numeroCuenta: string;
  banco: string;
  tipoCuenta: string;
}

export interface CuentadanteGilResponse {
  id: string;
  nombre: string;
  documento?: string;
}

export interface BienGilResponse {
  codigo: string;
  descripcion: string;
  um: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

export interface GilResponse {
  id: string;
  numeroGil: string;
  fecha: string;
  centroFormacionId: string;
  area: string;
  cuentadantes: CuentadanteGilResponse[];
  destino: string;
  fichaId: string;
  estado: 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO';
  programaId?: string;
  emitidoPor?: string;
  resultadoAprendizaje?: string;
  actividades?: string;
  voceroNombre?: string;
  voceroDocumento?: string;
  solicitudesOrigenIds?: string[];
  observaciones?: string;
  bienes?: BienGilResponse[];
}

export interface CrearGilRequest {
  fecha: string;
  centroFormacionId?: string;
  area?: string;
  cuentadantes?: CuentadanteGilResponse[];
  destino?: string;
  fichaId?: string;
}

export type ActualizarGilRequest = Partial<CrearGilRequest>;

export interface VincularInstructorRequest {
  instructorId: string;
}

/** PUT /procurement/giles/{id}/enviar-proveedor */
export interface EnviarProveedorRequest {
  proveedorDestinatarioId: string;
  fechaEnvio: string;
}

// ─── Sourcing — Conciliación Factura-GIL (/api/v1/sourcing/conciliaciones-gil) ─

export interface GilDiferenciaItemResponse {
  gilItemId:            string;
  descripcion:          string;
  cantidadGil:          number;
  cantidadFactura:      number;
  precioUnitarioGil:    number;
  precioUnitarioFactura: number;
  diferencia:           number;
  observacion?:         string;
  resuelta:             boolean;
}

/** Respuesta de POST, GET y PATCH /sourcing/conciliaciones-gil */
export interface ConciliacionGilResponse {
  id:          string;
  facturaId:   string;
  gilId:       string;
  estado:      string;
  diferencias: GilDiferenciaItemResponse[];
}

/** POST /sourcing/conciliaciones-gil */
export interface ConciliarRequest {
  facturaId: string;
  gilId:     string;
}

/** PATCH /sourcing/conciliaciones-gil/{id}/diferencias/{gilItemId}/resolver */
export interface ResolverDiferenciaGilRequest {
  observacion: string;
}
