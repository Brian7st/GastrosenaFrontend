import { ProductoCatalogo, BienFormDto, Bien, EstadoBien } from '../../models/inventario.model';
import { ProductoResponse, CrearProductoRequest, ActualizarProductoRequest } from '../api/catalog.api';
import { ExistenciaResponse } from '../api/inventory.api';

// ── Catálogo → ProductoCatalogo ──────────────────────────────────────────────

export function productoFromApi(dto: ProductoResponse): ProductoCatalogo {
  return {
    id: dto.id,
    codigoSena: dto.codigoSena,
    codigoProveedor: dto.codigoProveedor,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    categoria: dto.categoria,
    unidadMedida: dto.unidadMedida,
  };
}

// ── Catálogo → Bien (sin stock) ──────────────────────────────────────────────

/** Mapea sólo con datos del catálogo. Estado derivado de la flag `activo`.
 *  Usar cuando no se dispone de existencias (ej. listado paginado). */
export function bienFromCatalogo(dto: ProductoResponse): Bien {
  return {
    id: dto.id,
    nombre: dto.nombre,
    codigoSena: dto.codigoSena,
    codigoProveedor: dto.codigoProveedor ?? '',
    descripcion: dto.descripcion ?? '',
    categoria: dto.categoria ?? '',
    unidadMedida: dto.unidadMedida,
    imagenUrl: dto.urlImagen ?? undefined,
    valor: dto.vrlAdjudicado ?? null,
    valorNeto: dto.vrlAntes ?? null,
    iva: dto.iva ?? null,
    estado: (dto.activo ? 'Activo' : 'Inactivo') as EstadoBien,
    stockActual: 0,
    stockMinimo: 0,
    estadoStock: dto.activo ? 'DISPONIBLE' : 'AGOTADO',
  };
}

// ── Catálogo + Existencia → Bien (con stock real) ────────────────────────────

/** Fusiona catálogo y existencia para componer un Bien con estado real de stock.
 *  Usar en la vista de detalle (`getBienById`). */
export function bienFromCatalogoYExistencia(
  cat: ProductoResponse,
  ex: ExistenciaResponse | null,
): Bien {
  const base = bienFromCatalogo(cat);
  if (!ex) return base;
  return {
    ...base,
    stockActual: ex.stockDisponible,
    stockMinimo: ex.stockMinimo,
    estadoStock: ex.bajoMinimo ? 'BAJO_STOCK' : ex.stockDisponible <= 0 ? 'AGOTADO' : 'DISPONIBLE',
    estado: derivarEstadoStock(ex.stockDisponible, ex.stockMinimo),
  };
}

// ── Helpers privados ─────────────────────────────────────────────────────────

function derivarEstadoStock(stock: number, minimo?: number): EstadoBien {
  if (stock <= 0)                              return 'Agotado';
  if (minimo !== undefined && stock <= minimo) return 'Bajo Stock';
  return 'Activo';
}

// ── Formulario → Request ─────────────────────────────────────────────────────

export function bienFormToRequest(form: BienFormDto): CrearProductoRequest {
  return {
    nombre: form.nombre,
    codigoSena: form.codigoSena,
    codigoProveedor: form.codigoProveedor,
    descripcion: form.descripcion,
    categoria: form.categoria,
    unidadMedida: form.unidadMedida,
    urlImagen: form.imagenUrl,
    vrlAdjudicado: form.vrlAdjudicado ?? null,
    vrlAntes: form.vrlAntes ?? null,
    iva: form.iva ?? null,
  };
}

export function bienFormToUpdateRequest(form: BienFormDto): ActualizarProductoRequest {
  return {
    nombre: form.nombre,
    codigoProveedor: form.codigoProveedor,
    descripcion: form.descripcion,
    categoria: form.categoria,
    unidadMedida: form.unidadMedida,
    urlImagen: form.imagenUrl,
    vrlAdjudicado: form.vrlAdjudicado ?? null,
    vrlAntes: form.vrlAntes ?? null,
    iva: form.iva ?? null,
  };
}
