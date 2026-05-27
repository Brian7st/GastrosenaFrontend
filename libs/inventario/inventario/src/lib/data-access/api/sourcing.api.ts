export type BackendDateArray = [number, number, number];
export type InfoBancariaTipo = 'AHORROS' | 'CORRIENTE';

export interface FacturaLineaResponse {
  productoId?: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  iva?: number;
  porcentajeIva?: number;
  subtotal?: number;
  valorIva?: number;
  total: number;
}

export interface FacturaResponse {
  id: string;
  numeroFactura: string;
  cufe: string;
  proveedorNit: string;
  proveedorNombre: string;
  proveedorBeneficiarioZese?: boolean;
  fechaEmision: BackendDateArray;
  fechaRecepcion: BackendDateArray;
  ordenCompra?: string | null;
  infoBancariaBanco?: string | null;
  infoBancariaCuenta?: string | null;
  infoBancariaTipo?: InfoBancariaTipo | null;
  estado: 'REGISTRADA' | 'VERIFICADA' | 'PAGADA' | 'ANULADA';
  lineas: FacturaLineaResponse[];
  subtotal: number;
  totalIva: number;
  valorRetencionZese?: number;
  total: number;
  instructorId?: string;
  motivoAnulacion?: string | null;
}

export interface FacturaPagedResponse {
  contenido: FacturaResponse[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  tamano: number;
}

export interface FacturaResumenResponse {
  montoRegistradas: number;
  totalGeneral: number;
  montoGeneral: number;
  totalRegistradas: number;
  totalVerificadas: number;
  montoVerificadas: number;
  totalPagadas: number;
  montoPagadas: number;
  totalAnuladas: number;
}

export interface RegistrarFacturaRequest {
  numeroFactura: string;
  cufe: string;
  proveedorNit: string;
  proveedorNombre: string;
  proveedorBeneficiarioZese?: boolean;
  fechaEmision: string;
  fechaRecepcion: string;
  infoBancariaBanco?: string;
  infoBancariaCuenta?: string;
  infoBancariaTipo?: InfoBancariaTipo;
  lineas: Array<{
    productoId?: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    porcentajeIva: number;
  }>;
  ordenCompra?: string;
}

export type ActualizarFacturaRequest = RegistrarFacturaRequest;

export interface AnularFacturaRequest {
  motivo: string;
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
  codigoSena: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

export interface GilResponse {
  id: string;
  numeroGil: string;
  estado: 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO';
  fechaSolicitud: string;
  regionalCodigo?: number;
  regionalNombre?: string;
  centroCostosCodigo?: number;
  centroCostosNombre?: string;
  area: string;
  destinoBienes: string;
  jefeOficinaCoordinador?: string;
  cuentadantes: CuentadanteGilResponse[];
  solicitante?: string;
  codigoGrupo?: string;
  fichaCaracterizacion: string;
  bienes?: BienGilResponse[];
  observaciones?: string;
  creadoEn?: string;
  actualizadoEn?: string;
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
