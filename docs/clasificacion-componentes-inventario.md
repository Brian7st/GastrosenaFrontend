# Clasificación real de componentes en `Frontend-inventario-actualizado`

> Fuente verificada: `C:\Users\MI PC\OneDrive\Desktop\microFrontends\Frontend-inventario-actualizado`

## Objetivo

Separar con criterio arquitectónico qué componentes del proyecto de inventario:

1. **sí deben subir a `shared/ui`**
2. **deben quedarse como semi-globales / patrones**
3. **son estrictamente de dominio inventario**

La regla es simple:

> **Si un componente conoce demasiado del negocio, NO pertenece a `shared/ui`.**

---

## 1. Componentes revisados

### Globales o base compartida ya extraídos / confirmados
- `src/app/shared/components/lucide-icon.component.ts`
- `src/app/core/config/lucide-icons.ts`
- `lib-gas-layout-frontend/projects/inventario-ui/src/lib/main-layout/*`
- `lib-gas-layout-frontend/projects/inventario-ui/src/lib/barra-lateral/*`
- `lib-gas-layout-frontend/projects/inventario-ui/src/lib/barra-superior/*`
- `lib-gas-layout-frontend/projects/inventario-ui/src/lib/models/nav.models.ts`
- `lib-gas-layout-frontend/projects/inventario-ui/src/lib/providers/inventario-ui.providers.ts`
- `lib-gas-layout-frontend/projects/inventario-ui/src/styles/*`

### Candidatos revisados dentro de inventario
- `bienes/components/bien-form-modal.component.ts`
- `bienes/components/delete-confirm-modal.component.ts`
- `facturas/components/factura-export-modal.component.ts`
- `conciliacion/components/export-modal.component.ts`
- `conciliacion/components/reverse-modal.component.ts`
- `presupuesto/components/exportar-reporte-modal.component.ts`
- `solicitudes-gil/components/solicitud-delete-modal.component.ts`
- `bienes/bienes-list.component.*`
- `facturas/facturas-list.component.*`
- `solicitudes-gil/solicitudes-gil-list.component.*`

---

## 2. Clasificación

## A. Globales de verdad → subir a `shared/ui`

Estos son patrones verdaderamente reutilizables entre dominios:

### 1. `LucideIconComponent`
**Estado:** Global confirmado  
**Motivo:** wrapper técnico reutilizable, no conoce dominio.

### 2. Providers/global icon registry
**Estado:** Global confirmado  
**Motivo:** infraestructura transversal, no negocio.

### 3. Layout shell (`main-layout`, `barra-lateral`, `barra-superior`)
**Estado:** Global confirmado  
**Motivo:** infraestructura visual del sistema completo.

### 4. Contratos de navegación
**Estado:** Global confirmado  
**Motivo:** navegación configurable transversal.

### 5. Search input / search box
**Fuente funcional:** patrón visible en `bienes-list.component.html`  
**Estado:** Global confirmado como patrón  
**Motivo:** búsqueda textual genérica, sin acoplamiento a inventario.

### 6. Select filter
**Fuente funcional:** patrón visible en `solicitudes-gil-list.component.html`  
**Estado:** Global confirmado como patrón  
**Motivo:** filtro por `select` totalmente reusable.

### 7. Export button
**Fuente funcional:** repetido conceptualmente en bienes, facturas, conciliación, presupuesto  
**Estado:** Global confirmado como patrón  
**Motivo:** el botón sí es global; el modal de exportación NO necesariamente.

### 8. Status badge
**Fuente funcional:** `badge-estado`, `status-badge` repetidos en bienes/facturas/solicitudes  
**Estado:** Global confirmado como patrón  
**Motivo:** la visualización del estado es reusable; lo que cambia es el mapping de estados.

### 9. Keyword confirmation modal
**Fuente funcional repetida:**
- `delete-confirm-modal.component`
- `solicitud-delete-modal.component`
- `reverse-modal.component`
  
**Estado:** Global confirmado como patrón  
**Motivo:** los tres implementan la misma idea:
- modal de peligro/advertencia
- input de confirmación
- keyword requerida (`ELIMINAR`, `ANULAR`)

**Decisión:** extraer un componente genérico y parametrizable, NO subir una versión amarrada a “bien” o “solicitud”.

### 10. Data table base
**Fuente funcional repetida:**
- `bienes-list.component.html`
- `facturas-list.component.html`
- `solicitudes-gil-list.component.html`

**Estado:** Global confirmado como base estructural  
**Motivo:** todas usan tabla, cabeceras, filas, acciones y wrapper.

**OJO:**  
El componente global debe ser **base**.  
Las columnas, celdas complejas y badges específicos siguen siendo de cada feature.

---

## B. Semi-globales → NO subir todavía, pero sí documentar como patrones

Estos componentes tienen reuso potencial, pero todavía están demasiado mezclados con una estética o flujo particular:

### 1. Pagination
**Presencia:** bienes, facturas, solicitudes  
**Estado:** Semi-global  
**Motivo:** la idea es reusable, pero hoy cada pantalla la resuelve distinto.

### 2. KPI cards / stat cards
**Presencia:** bienes, facturas, solicitudes  
**Estado:** Semi-global  
**Motivo:** visualmente repetibles, pero el contenido y layout todavía cambian bastante.

### 3. Modal shell / modal container
**Presencia:** export, delete, reverse, form modals  
**Estado:** Semi-global  
**Motivo:** el contenedor base podría abstraerse, pero primero conviene estabilizar 2 o 3 variantes reales.

### 4. Action buttons row
**Presencia:** tablas de bienes/facturas/solicitudes  
**Estado:** Semi-global  
**Motivo:** concepto reusable, implementación aún muy amarrada a cada tabla.

### 5. Filter toolbar
**Presencia:** bienes-list, solicitudes-list, facturas-list  
**Estado:** Semi-global  
**Motivo:** el patrón existe, pero todavía no hay una API uniforme.

---

## C. Específicos de dominio inventario → NO subir a `shared/ui`

Estos deben quedarse en su feature:

### 1. `BienFormModalComponent`
**Motivo:** conoce completamente el dominio bien/inventario.

### 2. `FacturaFormModalComponent`
**Motivo:** conoce la forma de facturación y sus campos.

### 3. `FacturaEditModalComponent`
**Motivo:** específico del ciclo de vida de facturas.

### 4. `FacturaExportModalComponent`
**Motivo:** exporta FEL con filtros de facturación concretos.

### 5. `ExportModalComponent` de conciliación
**Motivo:** flujo de consolidado contable específico.

### 6. `ExportarReporteModalComponent` de presupuesto
**Motivo:** filtros de programa/rubro/instructor totalmente de presupuesto.

### 7. `ReverseModalComponent`
**Motivo:** el patrón de confirmación sí es global, pero esta versión concreta pertenece a conciliación.

### 8. `SolicitudDeleteModalComponent`
**Motivo:** la versión concreta conoce `codigoSolicitud` y copy del dominio GIL.

### 9. `BienesListComponent`, `FacturasListComponent`, `SolicitudesGilListComponent`
**Motivo:** son pantallas de dominio, no componentes globales.

### 10. `AlertasStockComponent`, `PresupuestoDashboardComponent`, `ConciliacionDetailComponent`, etc.
**Motivo:** full negocio.

---

## 3. Decisiones ya aplicadas al monorepo

Ya quedaron extraídos o reforzados en `shared/ui` / `libs/shell/shell`:

- shell global
- navegación global
- providers de íconos
- `LucideIconComponent`
- `StatusBadgeComponent`
- `ExportButtonComponent`
- `SearchFilterComponent`
- `DataTableComponent`
- `KeywordConfirmModalComponent`
- `SelectFilterComponent`

---

## 4. Próximo bloque recomendado

## Extraer después
1. `PaginationComponent` genérico
2. `ModalContainerComponent` base
3. `StatsCardComponent`
4. `TableActionsComponent`

## Mantener por ahora en feature
1. formularios de bienes/facturas
2. modales de exportación específicos
3. dashboards
4. detail pages
5. create/edit flows

---

## 5. Regla práctica para futuras extracciones

Antes de subir algo a `shared/ui`, responder:

1. ¿Lo usan 3 o más pantallas?
2. ¿Se puede parametrizar sin meter lógica de negocio?
3. ¿El nombre del componente no depende del dominio?
4. ¿La API sería estable también para restaurante, cocina o usuarios?

Si alguna respuesta es **no**, entonces NO va a `shared/ui`.

---

## 6. Resumen ejecutivo

### Globales confirmados
- shell
- navegación
- íconos
- search/filter básicos
- export button
- status badge
- data table base
- keyword confirm modal

### Semi-globales
- paginación
- kpi cards
- modal shell
- filter toolbar
- row actions

### Específicos de inventario
- forms
- export modals especializados
- detail/list/create/edit pages
- dashboards de negocio
