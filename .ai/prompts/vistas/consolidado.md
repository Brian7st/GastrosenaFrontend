# Vista: Consolidado (`consolidado-page`)

## Archivos a crear

```
data-access/services/consolidado.service.ts    ← CREAR
data-access/consolidado.facade.ts              ← CREAR
models/consolidado.model.ts                    ← CREAR (no existe)
models/mappers/consolidado.mapper.ts           ← CREAR
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar consolidados | GET | `/api/v1/budget/consolidados` |
| Obtener por número | GET | `/api/v1/budget/consolidados/{numero}` |
| Compromisos presupuestales | GET | `/api/v1/budget/compromisos` |
| Ejecución presupuestal | GET | `/api/v1/reporting/ejecucion-presupuestal` |

## DTO que retorna el backend

```typescript
export interface ConsolidadoBackendDto {
  id: string;
  numero: number;
  fechaGeneracion: string;    // ISO date
  generadoPor: string;        // userId
  lineas: LineaConsolidadoDto[];
  totales: TotalesDto;
}

export interface LineaConsolidadoDto {
  gilId?: string;
  compromisoId?: string;
  facturaId?: string;
  concepto: string;
  fecha: string;
  numeroFactura?: string;
  cufe?: string;
  monto: number;
  retencionZese: number;
}

export interface TotalesDto {
  sumaMontos: number;
  sumaRetencionZese: number;
  valorNeto: number;
}
```

## Modelo frontend a crear (`consolidado.model.ts`)

```typescript
export interface LineaConsolidado {
  gilId?: string;
  compromisoId?: string;
  facturaId?: string;
  concepto: string;
  fecha: string;
  numeroFactura?: string;
  cufe?: string;
  monto: number;
  retencionZese: number;
}

export interface TotalesConsolidado {
  sumaMontos: number;
  sumaRetencionZese: number;
  valorNeto: number;
}

export interface Consolidado {
  id: string;
  numero: number;
  fechaGeneracion: string;
  generadoPor: string;
  lineas: LineaConsolidado[];
  totales: TotalesConsolidado;
}

export interface ConsolidadoFiltros {
  numero?: number;
}
```

## Mapa de campos

En este caso el backend y el frontend tienen prácticamente los mismos nombres.
El mapper es casi 1:1 — solo asegurate de que los tipos numéricos no vengan como string.

## Patrón de migración

No hay servicio ni facade ni modelo. Creá todo desde cero.
La página de consolidado posiblemente use actualmente la data del `presupuesto.model.ts`.
Separar en su propio modelo y servicio.
