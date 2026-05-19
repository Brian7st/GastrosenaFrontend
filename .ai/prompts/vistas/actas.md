# Vista: Actas (`actas-page`)

## Archivos a crear/modificar

```
data-access/services/acta.service.ts    ← CREAR
data-access/acta.facade.ts              ← CREAR
models/mappers/acta.mapper.ts           ← CREAR
models/acta.model.ts                    ← eliminar MOCK_* al final
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar actas | GET | `/api/v1/legalization/actas` |
| Crear acta | POST | `/api/v1/legalization/actas` |
| Exportar | POST | `/api/v1/legalization/actas/{id}/exportar` |
| Enviar a firmas | POST | `/api/v1/legalization/actas/{id}/enviar-a-firmas` |
| Firmar | POST | `/api/v1/legalization/actas/{id}/firmar` |
| Revisar | POST | `/api/v1/legalization/actas/{id}/revisar` |
| Archivar | POST | `/api/v1/legalization/actas/{id}/archivar` |

Query params para listar: `?fichaId=xxx&instructorId=xxx&estado=BORRADOR`

## DTO que retorna el backend

```typescript
// GET /api/v1/legalization/actas
export interface ActaBackendDto {
  id: string;
  numeroActa: number;           // frontend: consecutivo (pero como number, no "Acta #0120")
  fecha: string;                // frontend: fechaTaller
  fichaId: string;              // frontend: ficha
  instructorId: string;         // frontend: instructor (backend envía ID, no nombre)
  requisicionId: string;        // frontend: requisicion
  estado: string;               // 'BORRADOR'|'PENDIENTE_FIRMAS'|'FIRMADA'|'REVISADA'|'ARCHIVADA'
}
```

## Mapa de campos: backend → frontend

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `id` | `id` | igual |
| `numeroActa` | `consecutivo` | formatear: `"Acta #" + numero.toString().padStart(4, '0')` |
| `fecha` | `fechaTaller` | renombrar |
| `fichaId` | `ficha` | renombrar |
| `instructorId` | `instructor` | backend envía ID — el nombre lo resuelve el componente o un pipe |
| `requisicionId` | `requisicion` | renombrar |
| `estado` | `estado` | capitalizar (ver tabla abajo) |
| — | `programa` | no existe en el DTO del backend |
| — | `ciudad`, `lugar`, `agendaSesion`, `desarrolloSesion` | no existen en el listado del backend |

## Mapper de estado

```typescript
const ESTADO_ACTA_MAP: Record<string, ActaEstado> = {
  BORRADOR:         'borrador',
  PENDIENTE_FIRMAS: 'pendiente',
  FIRMADA:          'firmada',
  REVISADA:         'revisada',
  ARCHIVADA:        'archivada',
};
```

## Campos del frontend sin equivalente en backend

- `programa` → no viene en el listado; inicializarlo como `fichaId` por ahora
- `ciudad`, `lugar` → el backend no los retorna en el listado (solo se envían al crear)
- `agendaSesion`, `desarrolloSesion`, `resultadoAprendizaje`, `actividadesEjecutadas` → igual, solo en creación

El backend retorna un DTO de listado mínimo. Los campos detallados solo estarán disponibles
cuando el backend implemente `GET /api/v1/legalization/actas/{id}`.

## Patrón de migración — Patrón A (mocks en el modelo)

El archivo `acta.model.ts` tiene `MOCK_ACTAS`, `MOCK_INSUMOS`, `MOCK_COMPROMISOS`, `MOCK_FIRMANTES`.
La tarea es:
1. CREAR servicio, facade y mapper
2. Eliminar los bloques `MOCK_*` del modelo
3. Migrar los componentes para usar la facade
