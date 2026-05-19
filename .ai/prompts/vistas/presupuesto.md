# Vista: Presupuesto (`presupuesto-page`)

## Archivos a crear/modificar

```
data-access/services/presupuesto.service.ts    ← CREAR
data-access/services/compromiso.service.ts     ← CREAR
data-access/presupuesto.facade.ts              ← CREAR
models/mappers/presupuesto.mapper.ts           ← CREAR
models/presupuesto.model.ts                    ← eliminar MOCK_* al final
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar presupuestos | GET | `/api/v1/budget/presupuestos` |
| Obtener presupuesto | GET | `/api/v1/budget/presupuestos/{id}` |
| Listar compromisos | GET | `/api/v1/budget/compromisos` |
| Consolidados | GET | `/api/v1/budget/consolidados` |
| Ejecución presupuestal | GET | `/api/v1/reporting/ejecucion-presupuestal` |

Query params para presupuestos: `?fichaId=xxx&vigencia=2024`

## DTO que retorna el backend

```typescript
// GET /api/v1/budget/presupuestos
export interface PresupuestoBackendDto {
  id: string;
  fichaId: string;
  programaFormacion: string;    // frontend: nombre del Programa
  vigencia: number;
  fechaAprobacion: string;
  rubros: RubroBackendDto[];
}

export interface RubroBackendDto {
  id: string;
  codigo: string;
  descripcion: string;          // frontend: nombre del Rubro
  montoAsignado: number;        // frontend: apropiacionInicial
  montoComprometido: number;    // frontend: comprometido
  montoPagado: number;          // frontend: pagado
  saldoDisponible: number;      // frontend: disponible
}
```

## Mapa de campos: backend → frontend

### Programa

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `id` | `id` | igual |
| `programaFormacion` | `nombre` | renombrar |
| `fichaId` | — | no está en el modelo `Programa` del frontend |
| `rubros` | `rubros` | mapear cada rubro |
| — | `totalApropiacion` | sumar `rubros[].montoAsignado` en el mapper |
| — | `totalDisponible` | sumar `rubros[].saldoDisponible` en el mapper |
| — | `totalComprometido` | sumar `rubros[].montoComprometido` en el mapper |
| — | `totalPagado` | sumar `rubros[].montoPagado` en el mapper |
| — | `totalZese` | **no existe en el backend por programa** → poner `0` por ahora |
| — | `porcentajeEjecucion` | calcular: `(comprometido / apropiacion) * 100` |

### Rubro

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `id` | `id` | igual |
| `codigo` | `codigo` | igual |
| `descripcion` | `nombre` | renombrar |
| `montoAsignado` | `apropiacionInicial` | renombrar |
| `montoComprometido` | `comprometido` | renombrar |
| `montoPagado` | `pagado` | renombrar |
| `saldoDisponible` | `disponible` | renombrar |
| — | `retencionZese` | no existe por rubro → poner `0` |
| — | `porcentajeEjecucion` | calcular: `(comprometido / apropiacion) * 100` |

## `PresupuestoResumen` — cómo construirlo

`PresupuestoResumen` no tiene endpoint propio. Calculalo en la facade a partir de los programas:

```typescript
function calcularResumen(programas: Programa[]): PresupuestoResumen {
  const totales = programas.reduce((acc, p) => ({
    totalApropiacion:  acc.totalApropiacion  + p.totalApropiacion,
    totalComprometido: acc.totalComprometido + p.totalComprometido,
    totalPagado:       acc.totalPagado       + p.totalPagado,
    totalDisponible:   acc.totalDisponible   + p.totalDisponible,
    totalZese:         acc.totalZese         + p.totalZese,
  }), { totalApropiacion: 0, totalComprometido: 0, totalPagado: 0, totalDisponible: 0, totalZese: 0 });

  return {
    vigenciaFiscal:     new Date().getFullYear(),
    corte:              new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' }),
    porcentajeEjecucion: (totales.totalComprometido / totales.totalApropiacion) * 100,
    variacionAnual:     0,   // requiere datos del año anterior, poner 0 por ahora
    ...totales,
  };
}
```

## Patrón de migración — Patrón A (mocks en el modelo)

El archivo `presupuesto.model.ts` tiene `MOCK_RESUMEN`, `MOCK_PROGRAMAS`, `MOCK_AFECTACIONES`, etc.
La tarea es:
1. CREAR servicio, facade y mapper
2. Eliminar los bloques `MOCK_*` del modelo
3. Migrar los componentes para usar la facade
