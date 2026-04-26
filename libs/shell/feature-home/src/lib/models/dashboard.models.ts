export interface KpiCard {
  label: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral' | 'alert';
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
