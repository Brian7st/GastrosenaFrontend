# Vista: Solicitudes GIL (`solicitudes-page`)

## Archivos a crear/modificar

```
data-access/services/gil.service.ts     ← CREAR
data-access/gil.facade.ts               ← CREAR
models/solicitudes-gil.model.ts         ← actualizar campos
models/mappers/gil.mapper.ts            ← CREAR
```

## Endpoints del backend

| Operación | Método | URL |
|---|---|---|
| Listar GILes | GET | `/api/v1/procurement/giles` |
| Obtener GIL | GET | `/api/v1/procurement/giles/{id}` |
| Crear GIL | POST | `/api/v1/procurement/giles` |
| Emitir | PATCH | `/api/v1/procurement/giles/{id}/emitir` |
| Enviar a proveedor | PATCH | `/api/v1/procurement/giles/{id}/enviar-proveedor` |
| Cerrar | PATCH | `/api/v1/procurement/giles/{id}/cerrar` |

Query params para listar: `?estado=BORRADOR&fichaId=xxx`

## DTO que retorna el backend

```typescript
export interface GilBackendDto {
  id: string;
  numeroGil: string;           // frontend: codigo
  fecha: string;               // igual
  centroFormacionId: string;   // frontend: centroCostos
  fichaId: string;             // frontend: ficha
  programaId: string;          // NO está en el frontend
  proveedorDestinatarioId?: string;
  fechaEnvioProveedor?: string;
  emitidoPor: string;
  destino: string;             // igual
  resultadoAprendizaje?: string;
  actividades?: string;
  voceroNombre?: string;
  voceroDocumento?: string;
  solicitudesOrigenIds?: string[];
  estado: string;              // 'BORRADOR' | 'EMITIDO' | 'ENVIADO_PROVEEDOR' | 'CERRADO'
  observaciones?: string;
  items: GilItemDto[];
  cuentadantes: GilCuentadanteDto[];
}

export interface GilItemDto {
  productoId: string;
  descripcion: string;
  unidadMedida: string;
  cantidadSolicitada: number;
  precioUnitarioGil: number;
  porcentajeIvaEsperado: number;
  justificacion?: string;
  estadoItem: string;
  totalEstimado: number;
}

export interface GilCuentadanteDto {
  nombre: string;
  documento: string;
  tipo: string;
}
```

## Mapa de campos: backend → frontend

| Campo backend | Campo frontend | Nota |
|---|---|---|
| `numeroGil` | `codigo` | renombrar |
| `centroFormacionId` | `centroCostos` | renombrar |
| `fichaId` | `ficha` | renombrar |
| `cuentadantes[0].nombre` | `cuentadante` | tomar el primero del array |
| `estado` (`'BORRADOR'`) | `estado` (`'Borrador'`) | capitalizar |
| `items.length` | `totalBienes` | calcular en mapper |
| `items.reduce(sum, totalEstimado)` | `montoTotal` | sumar en mapper |
| `avatarColor` | — | campo UI, asignarlo como `'blue'` por defecto en mapper |

## CRÍTICO — estados del GIL

El flujo del backend es diferente al del frontend. Usá el mapa siguiente en el mapper:

```typescript
const ESTADO_GIL_MAP: Record<string, EstadoGil> = {
  BORRADOR:          'Borrador',
  EMITIDO:           'Pendiente',    // mapeo acordado
  ENVIADO_PROVEEDOR: 'Validado',     // mapeo acordado
  CERRADO:           'Procesado',    // mapeo acordado
};
```

> Este mapeo es provisional hasta que el equipo defina el flujo definitivo.
> Dejá un comentario en el mapper explicando esto.

## Patrón de migración — Patrón C (datos inline en el componente)

`SolicitudesListComponent` tiene los datos hardcodeados en el signal del componente.
La tarea es:
1. CREAR `GilService` y `GilFacade` nuevos
2. El componente debe pasar a hacer `inject(GilFacade)` y llamar `gilFacade.cargar()` en `ngOnInit`
3. Eliminar el signal interno de mocks del componente
4. NO toques el template `.html`
