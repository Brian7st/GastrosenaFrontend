# Vista: Facturas (`facturas-page`)

## Archivos a modificar

```
data-access/services/facturas.service.ts    ← reemplazar mocks con HttpClient
data-access/facturas.facade.ts              ← agregar error signal, usar .asReadonly()
models/mappers/factura.mapper.ts            ← CREAR
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar facturas | GET | `/api/v1/sourcing/facturas` |
| Obtener factura | GET | `/api/v1/sourcing/facturas/{id}` |
| Registrar factura | POST | `/api/v1/sourcing/facturas` |
| Verificar | PATCH | `/api/v1/sourcing/facturas/{id}/verificar` |
| Anular | PATCH | `/api/v1/sourcing/facturas/{id}/anular` |

## DTO que retorna el backend

```typescript
export interface FacturaBackendDto {
  id: string;
  numeroFactura: string;        // frontend: numeroFEL
  proveedorNit: string;         // frontend: nitEmisor
  proveedorNombre: string;      // frontend: proveedor
  totalIva: number;             // frontend: ivaTotal
  lineas: LineaFacturaDto[];    // frontend: items
  instructorId: string;         // frontend: instructorCuentadante
  estado: string;               // 'REGISTRADA' | 'VERIFICADA' | 'PAGADA' | 'ANULADA'
  fechaEmision: string;
  subtotal: number;
  total: number;
  valorRetencionZese: number;   // ojo: es valor monetario, no porcentaje
  fechaRecepcion: string;       // frontend usa fechaVencimiento — aclarar con backend
  cufe?: string;
}

export interface LineaFacturaDto {
  productoId: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  porcentajeIva: number;        // frontend: iva
  subtotal: number;
  valorIva: number;
}
```

## Mapa de campos: backend → frontend

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `numeroFactura` | `numeroFEL` | renombrar |
| `proveedorNit` | `nitEmisor` | renombrar |
| `proveedorNombre` | `proveedor` | renombrar |
| `totalIva` | `ivaTotal` | renombrar |
| `lineas` | `items` | renombrar |
| `instructorId` | `instructorCuentadante` | renombrar |
| `estado` (`'REGISTRADA'`) | `estado` (`'Registrada'`) | capitalizar en mapper |
| `valorRetencionZese` | `retencionZESE` | es valor monetario, no porcentaje |
| `fechaRecepcion` | `fechaVencimiento` | pendiente de aclarar — usá `fechaRecepcion` |
| `lineas[].porcentajeIva` | `items[].iva` | renombrar |

## Mapper de estado — capitalizar

```typescript
const ESTADO_MAP: Record<string, EstadoFactura> = {
  REGISTRADA: 'Registrada',
  VERIFICADA: 'Verificada',
  PAGADA:     'Pagada',
  ANULADA:    'Anulada',
};

function mapEstado(raw: string): EstadoFactura {
  return ESTADO_MAP[raw] ?? 'Registrada';
}
```

## Campos del frontend que NO existen en el backend — qué hacer

- `nitReceptor` — eliminar del modelo por ahora
- `razonSocial` — usar `proveedorNombre` (son equivalentes)
- `tipoDocumento` — eliminar por ahora
- `moneda` — hardcodear `'COP'` en el mapper
- `gilVinculado` — viene de endpoint separado `GET /api/v1/sourcing/conciliaciones-gil?facturaId=X`; no incluir en la carga inicial
- `notasInternas`, `archivosAdjuntos` — eliminar por ahora
- `conciliacion` — viene de endpoint separado; no incluir en la carga inicial

## Patrón de migración — Patrón B (ya existe servicio)

`FacturasService` y `FacturasFacade` ya existen. La tarea es:
1. Reemplazar el cuerpo de los métodos del servicio (de `of(MOCK)` a `this.http.get(...)`)
2. Crear el mapper con el renombramiento de campos
3. Actualizar la facade para agregar `_error` signal
4. Actualizar el modelo `Factura` para eliminar los campos inexistentes
