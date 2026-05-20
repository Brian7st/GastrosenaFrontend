// ──────────────────────────────────────────────────────────────────────────────
// Modelos del módulo de Conciliación de Inventario (RF-5.8)
// ──────────────────────────────────────────────────────────────────────────────

export interface ConciliacionRegistro {
  id: string;
  fecha: string;
  ubicacion: string;
  itemsTotal: number;
  itemsDif: number;
  precision: number;
  estado: string;
  estadoColor: 'success' | 'info' | 'warning' | 'error';
}

export interface ConciliacionDetalle {
  id: string;
  fecha: string;
  responsable: string;
  almacen: string;
  estado: string;
  totalItems: number;
  itemsCorrectos: number;
  diferencias: number;
  precision: number;
  valoracionMonetaria: number;
  perdidas: number;
  sobrantes: number;
}

export interface ConciliacionDiferencia {
  producto: string;
  codigo: string;
  categoria: string;
  stockSis: string;
  fisico: string;
  dif: string;
  valorUnit: number;
  impacto: number;
  isPositive: boolean;
}

export interface TomaFisicaItem {
  id: string;
  codigoSena: string;
  categoria: string;
  producto: string;
  stockSistema: number;
  conteoFisico: number | null;
  valorUnitario: number;
}

export interface TopDiferencia {
  producto: string;
  dif: string;
  icon: string;
}
