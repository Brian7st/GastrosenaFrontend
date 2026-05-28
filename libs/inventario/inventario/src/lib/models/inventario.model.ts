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
  valor: number | null;
  valorNeto: number | null;
  iva: number | null;
  estado: EstadoBien;
  imagenUrl?: string;
  tieneHistorial?: boolean;
  proveedor?: string;
  fechaCompra?: string;
  kilos?: number;
  factorConversion?: number;
  depreciacionAnual?: number;
  especificaciones?: EspecificacionesTecnicas;
  facturas?: FacturaBien[];
}

export interface MovimientoBien {
  id: string | number;
  fecha: string | Date;
  tipo: 'ENTRADA' | 'SALIDA' | 'TRASLADO';
  responsable: string;
  ubicacion: string;
  cantidad: number;
  observacion: string;
}

export interface BienFiltros {
  busqueda?: string;
  categoria?: string;
  estado?: EstadoBien;
  page?: number;
  size?: number;
}

export interface BienPaginacion {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface BienKpis {
  valorTotal: number;
  totalAlertas: number;
  movimientosHoy: number;
  tendenciaValor?: number;
}

export interface BienExportConfig {
  formato: 'pdf' | 'excel' | 'csv';
  soloActivos?: boolean;
  soloBajoStock?: boolean;
  categoria?: string;
  almacen?: string;
  rangoFechas?: { inicio: string; fin: string };
}

export interface BienImportRow {
  codigoSena?: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  unidadMedida: string;
  codigoProveedor?: string;
  urlImagen?: string;
  vrlAdjudicado?: number;
  vrlAntes?: number;
  iva?: number;
  validacion?: 'Correcto' | 'Código duplicado' | 'Falta campo' | string;
  error?: string;
}
export interface ProductoCatalogo {
  id: string | number;
  codigoSena: string;
  codigoProveedor?: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
}

export interface ExistenciaProducto {
  productoId: string | number;
  stockFisico: number;
  stockReservado: number;
  stockDisponible: number;
  stockMinimo: number;
  bajoMinimo: boolean;
  codigoSena?: string;
  nombre?: string;
  categoria?: string;
  unidadMedida?: string;
}

export type BienVista = ProductoCatalogo & Partial<Omit<ExistenciaProducto, 'productoId'>>;

export interface BienFormDto {
  nombre: string;
  codigoSena?: string;
  codigoProveedor?: string;
  descripcion?: string;
  categoria: string;
  unidadMedida: string;
  imagenUrl?: string;
  vrlAdjudicado?: number | null;
  vrlAntes?: number | null;
  iva?: number | null;
}

