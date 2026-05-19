# Vista: Alertas (`alertas-page`)

## Archivos a crear/modificar

```
data-access/services/alertas.service.ts     ← CREAR
data-access/alertas.facade.ts               ← CREAR
models/mappers/alerta.mapper.ts             ← CREAR
models/alerta.model.ts                      ← eliminar los MOCK_* al final del archivo
```

## Endpoints del backend

La página de alertas combina **dos fuentes** para construir la vista:

| Operación | Método | URL | Para qué |
|---|---|---|---|
| Productos bajo mínimo | GET | `/api/v1/inventory/existencias/bajo-minimo` | Lista las alertas de stock |
| Catálogo de productos | GET | `/api/v1/catalog/productos` | Obtiene nombre, categoría, unidad |
| Resolver alerta | PATCH | `/api/v1/alerts/alertas/{id}/resolver` | Marcar como resuelta |
| Listar notificaciones | GET | `/api/v1/alerts/alertas` | Alertas del sistema (diferente a stock) |

## DTOs del backend

```typescript
// De /api/v1/inventory/existencias/bajo-minimo
export interface ExistenciaBackendDto {
  productoId: string;
  stockFisico: number;
  stockReservado: number;
  stockDisponible: number;
  stockMinimo: number;
  bajoMinimo: boolean;
}

// De /api/v1/catalog/productos
export interface ProductoBackendDto {
  id: string;
  codigoSena: string;
  nombre: string;
  categoria: string;
  unidadMedida: string;
  activo: boolean;
}
```

## Construcción del modelo `Alerta` en el mapper

El modelo `Alerta` del frontend combina ambas fuentes. Construilo así:

```typescript
export function mapAlertaFromBackend(
  existencia: ExistenciaBackendDto,
  producto: ProductoBackendDto
): Alerta {
  const prioridad = calcularPrioridad(existencia);
  return {
    id:                  existencia.productoId,
    codigoSena:          producto.codigoSena,
    nombreBien:          producto.nombre,
    categoria:           producto.categoria,
    ubicacion:           'Sin ubicación',        // backend no tiene este dato aún
    prioridad,
    estado:              'activa',
    stockActual:         existencia.stockFisico,
    stockMinimo:         existencia.stockMinimo,
    stockObjetivo:       existencia.stockMinimo * 2,  // regla provisional
    unidad:              producto.unidadMedida,
    diasRestantes:       0,                      // backend no retorna este cálculo
    valorEnRiesgo:       0,                      // backend no retorna este cálculo
    notificacionEnviada: false,
    fechaAlerta:         new Date().toISOString(),
    tendencia:           [],                     // backend no retorna histórico de tendencia
    historialIncidencias: [],
  };
}

function calcularPrioridad(e: ExistenciaBackendDto): AlertaPrioridad {
  if (e.stockDisponible === 0) return 'critica';
  const porcentaje = e.stockFisico / e.stockMinimo;
  if (porcentaje < 0.25) return 'alta';
  if (porcentaje < 0.5)  return 'media';
  return 'baja';
}
```

## Carga en la facade con forkJoin

```typescript
cargar(): void {
  this._loading.set(true);
  this._error.set(null);

  forkJoin({
    existencias: this.existenciasService.getBajoMinimo(),
    productos:   this.productosService.getAll(),
  }).pipe(
    finalize(() => this._loading.set(false))
  ).subscribe({
    next: ({ existencias, productos }) => {
      const productoMap = new Map(productos.map(p => [p.id, p]));
      const alertas = existencias
        .filter(e => productoMap.has(e.productoId))
        .map(e => mapAlertaFromBackend(e, productoMap.get(e.productoId)!));
      this._alertas.set(alertas);
    },
    error: err => this._error.set(err.message),
  });
}
```

## Campos que el backend no tiene (campos UI)

Los siguientes campos del modelo `Alerta` no tienen datos reales del backend aún.
Iniciálos con valores por defecto en el mapper y dejá un comentario:

- `diasRestantes` → `0` (requiere cálculo de consumo histórico)
- `valorEnRiesgo` → `0` (requiere precio unitario del producto)
- `tendencia[]` → `[]` (requiere historial de movimientos)
- `historialIncidencias[]` → `[]` (requiere historial de alertas)
- `ubicacion` → `'Sin ubicación'` (backend no tiene este campo)

## Patrón de migración — Patrón A (mocks en el modelo)

El archivo `alerta.model.ts` tiene `MOCK_ALERTAS`, `MOCK_HISTORIAL`, `MOCK_UMBRALES` al final.
La tarea es:
1. CREAR el servicio y la facade
2. Eliminar los bloques `MOCK_*` del modelo
3. Migrar los componentes de la página para usar la facade
