export type BackendDateArray = [number, number, number];
export type InfoBancariaTipo = 'AHORROS' | 'CORRIENTE';

// ─── Facturas Proveedor (/api/v1/sourcing/facturas) ────────────────────────

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

// ─── GIL — Request types (alineados con CrearGilHttpRequest del backend) ───

/** Cuentadante en requests — sin id, cedula obligatoria */
export interface CuentadanteGilRequest {
  nombre: string;
  cedula: string;
}

/** Ítem de bien en requests — nombres de campo del backend */
export interface BienGilRequest {
  codigoSena: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

/** POST /api/v1/procurement/giles */
export interface CrearGilRequest {
  fechaSolicitud: string;
  regionalCodigo: number;
  regionalNombre: string;
  centroCostosCodigo: number;
  centroCostosNombre: string;
  area: string;
  destinoBienes: string;
  jefeOficinaCoordinador: string;
  cuentadantes: CuentadanteGilRequest[];
  solicitante: string;
  codigoGrupo: string;
  fichaCaracterizacion: string;
  solicitudesOrigenIds?: string[];
  bienes: BienGilRequest[];
  observaciones?: string;
}

/** POST /api/v1/procurement/giles/generar — genera un GIL desde solicitudes de sesión aprobadas */
export interface GenerarGilRequest {
  solicitudSesionIds: string[];
  fechaSolicitud: string;
  regionalCodigo: number;
  regionalNombre: string;
  centroCostosCodigo: number;
  centroCostosNombre: string;
  area: string;
  destinoBienes: string;
  jefeOficinaCoordinador: string;
  cuentadantes: CuentadanteGilRequest[];
  solicitante: string;
  codigoGrupo: string;
  fichaCaracterizacion: string;
  observaciones?: string;
}

// ─── GIL — Response types (canonical definitions live in procurement.api.ts) ──
export {
  BienGilResponse,
  CuentadanteGilResponse,
  GilResponse,
  EstadoGil,
} from './procurement.api';

/** PUT → PATCH /api/v1/procurement/giles/{id}/enviar-proveedor */
export interface EnviarProveedorRequest {
  proveedorDestinatarioId: string;
  fechaEnvio: string;
}

export interface VincularInstructorRequest {
  instructorId: string;
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
