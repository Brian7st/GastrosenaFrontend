export interface KpiCard {
  label: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral' | 'alert';
  icon: string;
  colorVariant: 'primary' | 'secondary' | 'alert' | 'muted';
}

export interface AlertaStock {
  id: number;
  bien: string;
  codigoInterno: string;
  cantidadActual: number;
  cantidadMinima: number;
  unidad: string;
  prioridad: 'Crítica' | 'Alta' | 'Media';
}

export interface MovimientoReciente {
  id: number;
  bien: string;
  tipo: 'Entry' | 'Exit';
  responsable: string;
  fecha: string;
  cantidad: number;
  unidad: string;
}

export interface AccesoRapido {
  label: string;
  icon: string;
  ruta: string;
}

export interface ItemPresupuestal {
  label: string;
  valor: string;
  porcentaje: number;
  nota: string;
  colorVariant: 'primary' | 'secondary' | 'alert';
}
