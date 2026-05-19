# Vista: Requisiciones (`requisiciones-page`)

## Archivos a crear

```
data-access/services/requisicion.service.ts    ← CREAR
data-access/requisicion.facade.ts              ← CREAR
models/requisicion.model.ts                    ← CREAR (no existe)
models/mappers/requisicion.mapper.ts           ← CREAR
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar requisiciones | GET | `/api/v1/legalization/requisiciones` |
| Crear requisición | POST | `/api/v1/legalization/requisiciones` |
| Despachar | PATCH | `/api/v1/legalization/requisiciones/{id}/despachar` |
| Firmar | PATCH | `/api/v1/legalization/requisiciones/{id}/firmar` |
| Exportar | POST | `/api/v1/legalization/requisiciones/{id}/exportar` |

Query params para listar: `?fichaId=xxx&instructorId=xxx&estado=CREADA`

## DTO que retorna el backend

```typescript
export interface RequisicionBackendDto {
  id: string;
  numero: string;               // ya formateado, ej: "45-S"
  fecha: string;                // ISO date
  diaSemana: string;            // ej: "Miércoles"
  horaSesion: string;           // ej: "08:00:00"
  fichaId: string;
  instructorId: string;
  instructorNombre: string;
  estado: string;               // 'CREADA' | 'DESPACHADA' | 'FIRMADA'
}
```

## Modelo frontend a crear (`requisicion.model.ts`)

Creá este archivo desde cero ya que no existe:

```typescript
export type EstadoRequisicion = 'Creada' | 'Despachada' | 'Firmada';

export interface Requisicion {
  id: string;
  numero: string;
  fecha: string;
  diaSemana: string;
  horaSesion: string;
  fichaId: string;
  instructorId: string;
  instructorNombre: string;
  estado: EstadoRequisicion;
}

export interface RequisicionFiltros {
  busqueda?: string;
  fichaId?: string;
  estado?: EstadoRequisicion;
}
```

## Mapa de campos: backend → frontend

Casi todo es directo, solo hay que capitalizar el estado:

```typescript
const ESTADO_REQ_MAP: Record<string, EstadoRequisicion> = {
  CREADA:    'Creada',
  DESPACHADA:'Despachada',
  FIRMADA:   'Firmada',
};
```

## Patrón de migración — Patrón A (mocks en componente o modelo)

No hay servicio ni facade. Creá todo desde cero.
Los componentes de `requisiciones-page/` probablemente tienen mocks inline.
Creá el servicio y la facade, luego migrá los componentes a usarla.
