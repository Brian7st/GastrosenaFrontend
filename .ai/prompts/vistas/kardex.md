# Vista: Kardex (`kardex-page`)

## Archivos a crear

```
data-access/services/kardex.service.ts    ← CREAR
data-access/kardex.facade.ts              ← CREAR
models/kardex.model.ts                    ← CREAR (no existe)
models/mappers/kardex.mapper.ts           ← CREAR
```

## Endpoints del backend

| Operación | Método | URL | Para qué |
|---|---|---|---|
| Kardex paginado | GET | `/api/v1/inventory/movimientos/{productoId}` | Listado de movimientos |
| Kardex valorizado | GET | `/api/v1/reporting/kardex` | Vista con costo ponderado |
| Exportar kardex | GET | `/api/v1/reporting/kardex/export` | Descarga Excel |

Query params paginado: `?pagina=0&tamano=20`
Query params valorizado: `?productoId=xxx&desde=2024-01-01T00:00:00&hasta=2024-12-31T23:59:59`

## DTO que retorna el backend

```typescript
// GET /api/v1/inventory/movimientos/{productoId}
export interface KardexPaginadoDto {
  movimientos: MovimientoDto[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
}

export interface MovimientoDto {
  id: string;
  productoId: string;
  cantidad: number;
  tipo: string;              // 'ENTRADA' | 'SALIDA' | 'RESERVA' | 'LIBERACION' | 'AJUSTE'
  referenciaOrigen?: string; // UUID del documento origen
  instructorId?: string;
  fechaMovimiento: string;   // ISO datetime
}
```

## Modelo frontend a crear (`kardex.model.ts`)

```typescript
export type TipoMovimiento = 'Entrada' | 'Salida' | 'Reserva' | 'Liberación' | 'Ajuste';

export interface MovimientoKardex {
  id: string;
  productoId: string;
  cantidad: number;
  tipo: TipoMovimiento;
  referenciaOrigen?: string;
  instructorId?: string;
  fechaMovimiento: string;
}

export interface KardexPaginado {
  movimientos: MovimientoKardex[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
}

export interface KardexFiltros {
  productoId?: string;
  desde?: string;
  hasta?: string;
  pagina?: number;
  tamano?: number;
}
```

## Mapa de campos: backend → frontend

```typescript
const TIPO_MAP: Record<string, TipoMovimiento> = {
  ENTRADA:    'Entrada',
  SALIDA:     'Salida',
  RESERVA:    'Reserva',
  LIBERACION: 'Liberación',
  AJUSTE:     'Ajuste',
};
```

## La facade maneja paginación

```typescript
private _pagina   = signal(0);
private _tamano   = signal(20);

readonly pagina   = this._pagina.asReadonly();
readonly tamano   = this._tamano.asReadonly();

irAPagina(pagina: number): void {
  this._pagina.set(pagina);
  this.cargar();
}
```

## Patrón de migración

No hay servicio ni facade ni modelo. Creá todo desde cero.
