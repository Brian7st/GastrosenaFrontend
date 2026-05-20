# Shared UI Showcase

Render oficial de `@restaurant/shared/ui` para revisión visual, screenshots limpios y documentación del sistema de diseño.

## Quick path

1. Levantá el showcase con `npx nx serve shared-ui-showcase`.
2. Abrí la sección que necesitás documentar.
3. Tomá la captura limpia del componente o patrón.
4. Subila a Notion o usala como referencia de revisión.

## Propósito

Este showcase existe para:

- revisar variantes y estados en aislamiento
- sacar screenshots sin ruido de una feature real
- documentar patrones de UI en Notion
- detectar deuda visual antes de que se propague a los dominios

## Fuente de verdad

El showcase **no duplica componentes**. Importa los bloques reales desde `@restaurant/shared/ui`, por eso lo que ves acá debe representar el sistema real.

| Área | Fuente |
|---|---|
| Componentes | `libs/shared/ui/src/index.ts` |
| Tokens y estilos | `libs/shared/ui/**` |
| Demos del showcase standalone | `apps/shared-ui-showcase/src/app/app.component.*` |
| Ruta integrada sin auth | `libs/shell/shell/src/lib/showcase/showcase.component.*` |

Regla base:

> si cambia `shared/ui`, el showcase y su documentación se revisan juntos.

## Cómo verlo

### App standalone

```bash
npx nx serve shared-ui-showcase
```

### Ruta integrada en shell

La shell también expone una ruta pública de revisión en `/showcase`.

## Qué muestra hoy

El showcase nuevo está organizado por secciones pensadas para documentar patrones, no solo componentes sueltos.

| Sección | Qué documenta |
|---|---|
| Button | jerarquía visual de acciones `primary`, `surface`, `ghost` y `filter` |
| Feedback | alerts y status badges para estados de sistema |
| Filtros | `SearchFilter` y `SelectFilter` con ejemplo realista de inventario |
| Headers y títulos | `PageHeader` y `SectionTitle` como jerarquía editorial |
| Data display | `KpiCard`, `LoadingSkeleton`, `EmptyState`, `DataTable`, `Card` y `ExportButton` |
| Confirmaciones | `ConfirmDialog` y `KeywordConfirmModal` para acciones sensibles |

## Componentes cubiertos

- Button
- Alert
- Status Badge
- Search Filter
- Select Filter
- Page Header
- Section Title
- KPI Card
- Loading Skeleton
- Empty State
- Data Table
- Card
- Export Button
- Confirm Dialog
- Keyword Confirm Modal

## Criterio de uso para documentación

Usalo cuando quieras responder rápido cualquiera de estas preguntas:

1. ¿Cómo se ve el componente real hoy?
2. ¿Qué variante conviene mostrar en la documentación?
3. ¿Qué screenshot sirve para revisión o Notion?
4. ¿Qué deuda visual salta a simple vista?

## Reglas

- no usar el showcase para lógica de negocio
- no copiar componentes dentro del showcase
- no inventar variantes visuales que `shared/ui` no soporte
- si falta un estado importante, primero se define si es un caso válido del sistema

## Riesgos

- que `shared/ui` evolucione y las demos queden desactualizadas
- que el showcase muestre solo casos felices y esconda deuda real
- que termine siendo una app paralela en vez de una herramienta de documentación
