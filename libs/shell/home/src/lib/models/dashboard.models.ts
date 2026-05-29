export interface KpiCard {
  label: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral' | 'alert' | 'info';
  icon: string;
}

export interface ModuleCard {
  label: string;
  description: string;
  icon: string;
  ruta: string;
  badgeCount?: number;
  badgeType?: 'alert' | 'info' | 'success';
}

export interface ActividadReciente {
  id: number;
  modulo: string;
  descripcion: string;
  usuario: string;
  hace: string;
  tipo: 'entry' | 'exit' | 'alert' | 'info';
}

export interface InventoryKpisResponse {
  valorTotal: number;
  totalAlertas: number;
  movimientosHoy: number;
  tendenciaValor?: number;
}

export interface AlertasResumenResponse {
  totalAlertas: number;
  alertasPendientes: number;
  alertasResueltas: number;
  productosCriticos: number;
  alertasPorTipo: { tipo: string; cantidad: number }[];
  ultimaAlerta?: string;
}

export interface FacturasResumenResponse {
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

export interface PresupuestoResumenResponse {
  totalPresupuestos: number;
  vigencia?: number;
  totalAsignado: number;
  totalComprometido: number;
  totalPagado: number;
  saldoGlobal: number;
  porcentajeEjecucion: number;
}

export interface CocinaKpisResponse {
  promedioDemoraGeneral: number;
  platoMasRapido: string;
  totalPlatosDespachadosHoy: number;
}

export interface BarKpisResponse {
  promedioDemoraGeneral: number;
  bebidaMasRapida: string;
  totalBebidasDespachadosHoy: number;
}

export interface MesaResponse {
  id: string;
  nombre: string;
  capacidad: number;
  zona: string | null;
  estado: 'LIBRE' | 'OCUPADA' | 'POR_PAGAR' | 'INACTIVA';
  activo: boolean;
}

export interface OperacionesData {
  cocina: CocinaKpisResponse | null;
  bar: BarKpisResponse | null;
}

export interface InventarioData {
  kpis: InventoryKpisResponse | null;
  alertas: AlertasResumenResponse | null;
  facturas: FacturasResumenResponse | null;
  presupuesto: PresupuestoResumenResponse | null;
}

export interface RestauranteData {
  mesas: MesaResponse[];
  pedidosActivos: number;
}
