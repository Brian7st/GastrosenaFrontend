# Vista: Conciliación (`conciliacion-page`)

## Archivos a crear

```
data-access/services/conciliacion.service.ts    ← CREAR
data-access/conciliacion.facade.ts              ← CREAR
models/conciliacion.model.ts                    ← CREAR (no existe)
models/mappers/conciliacion.mapper.ts           ← CREAR
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar conciliaciones | GET | `/api/v1/reconciliation/conciliaciones` |
| Obtener conciliación | GET | `/api/v1/reconciliation/conciliaciones/{id}` |
| Iniciar conciliación | POST | `/api/v1/reconciliation/conciliaciones` |
| Registrar conteo | POST | `/api/v1/reconciliation/conciliaciones/{id}/conteo` |
| Resolver diferencia | PATCH | `/api/v1/reconciliation/conciliaciones/{id}/diferencias/{difId}/resolver` |
| Cerrar | PATCH | `/api/v1/reconciliation/conciliaciones/{id}/cerrar` |
| Exportar Excel | GET | `/api/v1/reconciliation/conciliaciones/export` |

Query params para listar: `?responsableId=xxx&tipo=FISICA&estado=ABIERTA&desde=2024-01-01&hasta=2024-12-31`

## DTO que retorna el backend

```typescript
export interface ConciliacionBackendDto {
  id: string;
  responsableId: string;
  responsableNombre: string;
  tipo: string;                     // 'FISICA' | 'DOCUMENTAL' | 'MIXTA'
  fecha: string;                    // ISO date
  estado: string;                   // 'ABIERTA' | 'CERRADA'
  totalItemsContados: number;
  precision: number;                // 0-100 porcentaje
  valorTotalDiferencias: number;
  diferencias: DiferenciaDto[];
}

export interface DiferenciaDto {
  id: string;
  codigoSena: string;
  descripcion: string;
  cantidadSistema: number;
  cantidadFisica: number;
  valorMonetario: number;
  estado: string;                   // 'PENDIENTE' | 'RESUELTA'
  justificacion?: string;
}
```

## Modelo frontend a crear (`conciliacion.model.ts`)

```typescript
export type TipoConciliacion  = 'Física' | 'Documental' | 'Mixta';
export type EstadoConciliacion = 'Abierta' | 'Cerrada';
export type EstadoDiferencia  = 'Pendiente' | 'Resuelta';

export interface Diferencia {
  id: string;
  codigoSena: string;
  descripcion: string;
  cantidadSistema: number;
  cantidadFisica: number;
  valorMonetario: number;
  estado: EstadoDiferencia;
  justificacion?: string;
}

export interface Conciliacion {
  id: string;
  responsableId: string;
  responsableNombre: string;
  tipo: TipoConciliacion;
  fecha: string;
  estado: EstadoConciliacion;
  totalItemsContados: number;
  precision: number;
  valorTotalDiferencias: number;
  diferencias: Diferencia[];
}

export interface ConciliacionFiltros {
  responsableId?: string;
  tipo?: TipoConciliacion;
  estado?: EstadoConciliacion;
  desde?: string;
  hasta?: string;
}
```

## Mappers de estado

```typescript
const TIPO_MAP: Record<string, TipoConciliacion> = {
  FISICA:      'Física',
  DOCUMENTAL:  'Documental',
  MIXTA:       'Mixta',
};

const ESTADO_MAP: Record<string, EstadoConciliacion> = {
  ABIERTA: 'Abierta',
  CERRADA: 'Cerrada',
};

const ESTADO_DIF_MAP: Record<string, EstadoDiferencia> = {
  PENDIENTE: 'Pendiente',
  RESUELTA:  'Resuelta',
};
```

## Patrón de migración

No hay servicio ni facade ni modelo. Creá todo desde cero.
