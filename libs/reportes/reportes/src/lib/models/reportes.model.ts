export type TipoReporte =
  | 'contadora'
  | 'administrador'
  | 'chef';

export type EstadoReporte =
  | 'Completado'
  | 'Pendiente'
  | 'En proceso'
  | 'Error';

export type PeriodicidadReporte =
  | 'diario'
  | 'semanal'
  | 'mensual'
  | 'trimestral';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoReporte;
}

export interface ReporteReciente {
  id: number | string;
  reporteId: string;
  formato: string;
  fechaGeneracion: string;
  usuarioId?: string;
}

export interface GenerarReporteRequest {
  reporteId: string;
  periodicidad: PeriodicidadReporte | '';
  tipo: TipoReporte | 'todos';
}

export interface GenerarReporteResponse {
  id: string;
  nombre: string;
  url: string;
  fechaGeneracion: string;
  estado: EstadoReporte;
}

export interface ReportesFilter {
  tipo?: TipoReporte | 'todos';
  periodicidad?: PeriodicidadReporte | '';
  pagina?: number;
  tamano?: number;
}