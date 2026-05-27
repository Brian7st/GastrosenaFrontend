// ─── Facturas Proveedor (/api/v1/sourcing/facturas) ────────────────────────

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

/**
 * Payload de creación: POST /api/v1/procurement/giles
 * Todos los campos son REQUIRED según validaciones del backend.
 */
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
  bienes: BienGilRequest[];
  observaciones?: string;
}

// ─── GIL — Response types (esperados del backend — verificar cuando haya datos) ──

/** Cuentadante en responses — incluye id y cedula */
export interface CuentadanteGilResponse {
  id: string;
  nombre: string;
  cedula: string;
}

/** Ítem de bien en responses */
export interface BienGilResponse {
  codigoSena: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

/**
 * Response del backend para GET /procurement/giles y GET /procurement/giles/{id}.
 * NOTA: el backend documenta el response como `type: object` sin schema explícito
 * (tarea BACKEND #2). Esta interface refleja los nombres esperados basados en el
 * contrato de request. Verificar y ajustar cuando el backend exponga GilResponse.
 */
export interface GilResponse {
  id: string;
  numeroGil: string;
  fechaSolicitud: string;
  regionalCodigo: number;
  regionalNombre: string;
  centroCostosCodigo: number;
  centroCostosNombre: string;
  area: string;
  destinoBienes: string;
  jefeOficinaCoordinador: string;
  cuentadantes: CuentadanteGilResponse[];
  solicitante: string;
  codigoGrupo: string;
  fichaCaracterizacion: string;
  estado: 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO';
  observaciones?: string;
  bienes?: BienGilResponse[];
  // Campos opcionales del módulo training (si el backend los incluye)
  programaId?: string;
  emitidoPor?: string;
  resultadoAprendizaje?: string;
  actividades?: string;
  voceroNombre?: string;
  voceroDocumento?: string;
  solicitudesOrigenIds?: string[];
}

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
