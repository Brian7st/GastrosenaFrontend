export interface KpiEstadisticas {
  pedidosActivos: number;
  tiempoPromedio: number;
  ingresosTotales: number;
  mesasAtendidas: number;
}

export interface TopMesa {
  mesa: string;
  cantidadOrdenes: number;
  totalConsumo: number;
}

export interface RendimientoMesero {
  nombre: string;
  ordenesAtendidas: number;
  mesasAsignadas: number;
  ingresosGenerados: number;
  promedioPorOrden: number;
  rendimiento: 'Excelente' | 'Bueno' | 'Regular';
}
