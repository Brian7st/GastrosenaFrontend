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
 * Especificaciones técnicas de un bien (equipos de cómputo, etc.)
 */
export interface EspecificacionesTecnicas {
  [clave: string]: string;
}

/**
 * Factura de abastecimiento vinculada a un bien.
 */
export interface FacturaBien {
  id: string | number;
  fel: string;
  cufe: string;
  proveedor: string;
  fecha: string;
  monto: number;
  estado: 'PAGADA' | 'CAUSADA' | 'PENDIENTE';
}

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
  valorNeto?: number;      // Valor sin IVA
  iva?: number;            // Porcentaje de IVA (19, 5, 0)
  estado: EstadoBien;
  imagenUrl?: string;
  tieneHistorial?: boolean;
  proveedor?: string;
  fechaCompra?: string;
  kilos?: number;
  factorConversion?: number;
  depreciacionAnual?: number; // Porcentaje anual
  especificaciones?: EspecificacionesTecnicas;
  facturas?: FacturaBien[];
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
  soloBajoStock?: boolean;
  categoria?: string;
  almacen?: string;
  rangoFechas?: { inicio: string; fin: string };
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
  um?: string;
  validacion?: 'Correcto' | 'Código duplicado' | 'Falta campo' | string;
  error?: string;
}

/**
 * Producto del catálogo (GET/POST /catalog/productos).
 * Solo contiene metadatos descriptivos; sin stock ni precio.
 */
export interface ProductoCatalogo {
  id: string | number;
  codigoSena: string;
  codigoProveedor?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
}

/**
 * Existencia de un producto en un centro de costo (GET /inventario/existencias).
 * El campo stockActual del backend se llama stockDisponible.
 */
export interface ExistenciaProducto {
  productoId: string | number;
  codigoSena: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  stockDisponible: number;
  stockMinimo?: number;
}

/**
 * Vista combinada para el listado/detalle de bienes en la UI.
 */
export type BienVista = ProductoCatalogo & Partial<Omit<ExistenciaProducto, 'productoId'>>;

/**
 * DTO para crear un producto en el catálogo (POST /catalog/productos).
 * El backend NO acepta stockMinimo ni datos de precio en este endpoint.
 */
export interface BienFormDto {
  nombre: string;
  codigoSena?: string;
  codigoProveedor?: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  imagenUrl?: string;
}
