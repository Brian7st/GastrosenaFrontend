import { ProductoCatalogo, BienFormDto } from '../../models/inventario.model';
import { ProductoResponse, CrearProductoRequest } from '../api/catalog.api';

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

export function bienFormToRequest(form: BienFormDto): CrearProductoRequest {
  return {
    nombre: form.nombre,
    codigoSena: form.codigoSena,
    codigoProveedor: form.codigoProveedor,
    descripcion: form.descripcion,
    categoria: form.categoria,
    unidadMedida: form.unidadMedida,
  };
}
