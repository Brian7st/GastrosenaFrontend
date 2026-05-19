# Vista: Paquete Probatorio (`paquete-probatorio-page`)

## Archivos a crear/modificar

```
data-access/services/paquete.service.ts    ← CREAR
data-access/paquete.facade.ts              ← CREAR
models/mappers/paquete.mapper.ts           ← CREAR
models/paquete.model.ts                    ← eliminar MOCK_* al final
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar paquetes | GET | `/api/v1/legalization/paquetes` |
| Crear paquete | POST | `/api/v1/legalization/paquetes` |
| Adjuntar asistencia | PATCH | `/api/v1/legalization/paquetes/{id}/adjuntar-asistencia` |
| Vincular trazabilidad | PATCH | `/api/v1/legalization/paquetes/{id}/trazabilidad` |
| Archivar | PATCH | `/api/v1/legalization/paquetes/{id}/archivar` |
| Exportar | POST | `/api/v1/legalization/paquetes/{id}/exportar` |

Query params para listar: `?fichaId=xxx&instructorId=xxx&estado=BORRADOR`

## DTO que retorna el backend

```typescript
export interface PaqueteBackendDto {
  id: string;
  actaId: string;
  requisicionId: string;
  fichaId: string;                        // frontend: ficha
  instructorId: string;                   // frontend: responsable (backend envía ID)
  registroAsistenciaAdjunto: boolean;
  estado: string;                         // 'BORRADOR'|'EN_REVISION'|'COMPLETO'|'ARCHIVADO'
  cufeFuenteId?: string;                  // frontend: cufe
  gilId?: string;                         // frontend: gilVinculado
  compromisoPresupuestalId?: string;
}
```

## Mapa de campos: backend → frontend

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `id` | `id` | igual |
| `fichaId` | `ficha` | renombrar |
| `instructorId` | `responsable` | backend envía ID, frontend muestra nombre — usar ID como fallback |
| `estado` | `estado` | capitalizar (ver tabla abajo) |
| `cufeFuenteId` | `cufe` | renombrar |
| `gilId` | `gilVinculado` | renombrar |
| `actaId` + `requisicionId` + `registroAsistenciaAdjunto` | `documentos[]` | construir array en mapper |
| — | `expediente` | no existe en el backend — construir con `"PKT-" + fecha.año + "-" + id.slice(-3)` |
| — | `titulo` | no existe — usar `fichaId` como placeholder |
| — | `programa` | no existe en el DTO — dejar vacío |
| — | `fecha` | no existe en el DTO — dejar vacío |

## Mapper de estado

```typescript
const ESTADO_PAQUETE_MAP: Record<string, PaqueteEstado> = {
  BORRADOR:     'borrador',
  EN_REVISION:  'en_revision',
  COMPLETO:     'completo',
  ARCHIVADO:    'archivado',
  INCOMPLETO:   'incompleto',
};
```

## Construir `documentos[]` en el mapper

```typescript
function mapDocumentos(dto: PaqueteBackendDto): DocumentoBase[] {
  return [
    { tipo: 'acta',        vinculado: !!dto.actaId,        referencia: dto.actaId ?? undefined },
    { tipo: 'requisicion', vinculado: !!dto.requisicionId, referencia: dto.requisicionId ?? undefined },
    { tipo: 'asistencia',  vinculado: dto.registroAsistenciaAdjunto },
  ];
}
```

## Patrón de migración — Patrón A (mocks en el modelo)

El archivo `paquete.model.ts` tiene `MOCK_PAQUETES`.
La tarea es:
1. CREAR servicio, facade y mapper
2. Eliminar los bloques `MOCK_*` del modelo
3. Migrar los componentes para usar la facade
