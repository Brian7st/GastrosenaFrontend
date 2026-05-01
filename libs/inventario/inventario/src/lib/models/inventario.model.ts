import { Bien as SharedBien } from '@restaurant/shared/models';

/**
 * Estados posibles de un bien en el inventario extendido para gestión.
 */
export type EstadoBien = 'Activo' | 'Bajo Stock' | 'Agotado' | 'Inactivo';

/**
 * Colores semánticos para las categorías (basado en el prototipo).
 */
export type CategoriaColor = 'blue' | 'amber' | 'green' | 'purple' | 'red' | 'slate';

/**
 * Representa un Bien (producto/activo) con todos los detalles necesarios 
 * para el módulo de administración de inventario.
 * Extiende la base de shared/models.
 */
export interface Bien extends Omit<SharedBien, 'id' | 'codigo'> {
  id: string | number;
  codigoSena: string;
  codigoProveedor: string;
  descripcion: string;
  categoriaColor?: CategoriaColor;
  valor: number;
  estado: EstadoBien;
  imagenUrl?: string;
  tieneHistorial?: boolean;
}

/**
 * Representa un movimiento (entrada/salida) de un bien.
 */
export interface MovimientoBien {
  id: string | number;
  fecha: string | Date;
  tipo: 'ENTRADA' | 'SALIDA' | 'TRASLADO';
  responsable: string;
  ubicacion: string;
  cantidad: number;
  observacion: string;
}

/**
 * Filtros para la búsqueda y listado de bienes.
 */
export interface BienFiltros {
  busqueda?: string;
  categoria?: string;
  estado?: EstadoBien;
}

/**
 * Indicadores clave de desempeño (KPIs) para el dashboard de bienes.
 */
export interface BienKpis {
  valorTotal: number;
  totalAlertas: number;
  movimientosHoy: number;
  tendenciaValor?: number; // Porcentaje de cambio
}

/**
 * Configuración para la exportación de bienes.
 */
export interface BienExportConfig {
  formato: 'pdf' | 'excel' | 'csv';
  soloActivos?: boolean;
  rangoFechas?: { inicio: Date; fin: Date };
}

/**
 * Estructura para la importación masiva de bienes.
 */
export interface BienImportRow {
  codigoPlaca: string;
  descripcion: string;
  serial: string;
  ubicacion: string;
  estado: EstadoBien;
  error?: string; // Para validación en UI
}

/**
 * DTO para el formulario de creación/edición de bienes.
 */
export interface BienFormDto extends Partial<Bien> {
  nombre: string;
  categoria: string;
  unidadMedida: string;
  stockMinimo: number;
  valor: number;
}
