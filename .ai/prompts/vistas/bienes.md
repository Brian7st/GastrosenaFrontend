# Vista: Bienes (`bienes-page`)

## Archivos a modificar

```
data-access/services/bienes.service.ts        ← reemplazar mocks con HttpClient
data-access/inventario.facade.ts              ← agregar error signal, usar .asReadonly()
models/mappers/bien.mapper.ts                 ← CREAR
models/mappers/existencia.mapper.ts           ← CREAR
data-access/services/existencias.service.ts   ← CREAR (segundo endpoint)
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar productos | GET | `/api/v1/catalog/productos` |
| Obtener producto | GET | `/api/v1/catalog/productos/{id}` |
| Existencia de un producto | GET | `/api/v1/inventory/existencias/{productoId}` |
| Todos bajo mínimo | GET | `/api/v1/inventory/existencias/bajo-minimo` |

## DTO que retorna el backend — `GET /api/v1/catalog/productos`

```typescript
export interface ProductoBackendDto {
  id: string;
  codigoSena: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  codigoProveedor?: string;
  activo: boolean;
}
```

## DTO que retorna el backend — `GET /api/v1/inventory/existencias/{id}`

```typescript
export interface ExistenciaBackendDto {
  productoId: string;
  stockFisico: number;
  stockReservado: number;
  stockDisponible: number;
  stockMinimo: number;
  bajoMinimo: boolean;
}
```

## Mapa de campos: backend → frontend (`Bien`)

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `id` | `id` | igual |
| `codigoSena` | `codigoSena` | igual |
| `nombre` | `nombre` | igual |
| `categoria` | `categoria` | igual |
| `unidadMedida` | `unidadMedida` | igual |
| `codigoProveedor` | `codigoProveedor` | igual, opcional |
| `activo` | — | se combina con existencia para calcular `estado` |
| `stockFisico` | `stockActual` | viene de existencias |
| `stockDisponible` | `stockDisponible` | viene de existencias |
| `stockMinimo` | `stockMinimo` | viene de existencias |

## Lógica especial — campo `estado`

El campo `estado: 'Activo' | 'Bajo Stock' | 'Agotado' | 'Inactivo'` se calcula combinando los dos endpoints:

```typescript
function calcularEstado(activo: boolean, existencia?: ExistenciaBackendDto): EstadoBien {
  if (!activo) return 'Inactivo';
  if (!existencia || existencia.stockDisponible === 0) return 'Agotado';
  if (existencia.bajoMinimo) return 'Bajo Stock';
  return 'Activo';
}
```

## Cómo cargar la lista en la facade

Usá `forkJoin` para pedir productos y existencias en paralelo:

```typescript
cargarBienes(filtros?: BienFiltros): void {
  this._loading.set(true);
  this._error.set(null);

  forkJoin({
    productos: this.productosService.getAll(filtros),
    existencias: this.existenciasService.getAllMap(), // retorna Map<productoId, Existencia>
  }).pipe(
    finalize(() => this._loading.set(false))
  ).subscribe({
    next: ({ productos, existencias }) => {
      const bienes = productos.map(p => ({
        ...p,
        stockActual: existencias.get(p.id)?.stockFisico ?? 0,
        stockDisponible: existencias.get(p.id)?.stockDisponible ?? 0,
        stockMinimo: existencias.get(p.id)?.stockMinimo ?? 0,
        estado: calcularEstado(p.activo, existencias.get(p.id)),
      }));
      this._bienes.set(bienes);
    },
    error: err => this._error.set(err.message),
  });
}
```

`ExistenciasService.getAllMap()` llama a `GET /api/v1/inventory/existencias/bajo-minimo`
y retorna `Observable<Map<string, ExistenciaBackendDto>>`.

## Campos del frontend que NO existen en el backend — qué hacer

Estos campos del modelo `Bien` actual no los retorna el backend. Eliminalos del modelo:

- `descripcion` — eliminar
- `valor`, `valorNeto`, `iva` — eliminar
- `imagenUrl` — eliminar
- `proveedor`, `fechaCompra` — eliminar
- `kilos`, `factorConversion`, `depreciacionAnual` — eliminar
- `especificaciones` — eliminar
- `facturas: FacturaBien[]` — eliminar

## Patrón de migración — Patrón B (ya existe servicio)

`BienesService` y `InventarioFacade` ya existen. La tarea es:
1. Reemplazar el cuerpo de los métodos del servicio (de `of(MOCK)` a `this.http.get(...)`)
2. Agregar `ExistenciasService` nuevo
3. Actualizar la facade para usar `forkJoin`
4. Crear los mappers
5. Actualizar el modelo `Bien` eliminando los campos que no existen en el backend
