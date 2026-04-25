# Inventario de proyectos y guía de organización para migración a monorepo

> Fuente: análisis directo del código en `C:\Users\MI PC\OneDrive\Desktop\microFrontends` el 24/04/2026.

## 1. Hallazgo principal

El repositorio raíz **todavía no es un monorepo Nx**. La arquitectura objetivo está documentada en `C:\Users\MI PC\OneDrive\Desktop\microFrontends\ARQUITECTURA.md`, pero la estructura real actual es un **conjunto de repos Angular separados** con distintos niveles de madurez.

### Evidencia verificable
- En la raíz **no existen** `package.json`, `nx.json`, `tsconfig.base.json` ni `.eslintrc.json`.
- En cambio, sí existen carpetas de proyectos independientes:
  - `cocina-frontend`
  - `Frontend-inventario-actualizado`
  - `ga-web-inicio-general`
  - `ga-web-restaurante`
  - `lib-gas-layout-frontend`

---

## 2. Inventario real de proyectos

| Proyecto | Tipo actual | Estado real | Observaciones clave |
|---|---|---|---|
| `ga-web-inicio-general` | Repo placeholder | **Muy incompleto** | Solo contiene `README.md`; no hay código fuente Angular. |
| `cocina-frontend` | Angular app | **Scaffold / prototipo vacío** | Tiene estructura base (`core`, `features`, `shared`), pero varios archivos críticos están en 0 bytes. |
| `ga-web-restaurante` | Angular app | **Funcional / intermedio** | Tiene layout propio, routing, componentes, modelos y servicios. |
| `Frontend-inventario-actualizado` | Angular app | **El más maduro** | Tiene muchas features, rutas y además consume una librería visual externa local. |
| `lib-gas-layout-frontend` | Angular library workspace | **Reutilizable** | Contiene la librería `inventario-ui`, que hoy actúa como design system/layout del módulo de inventario. |

---

## 3. Métricas rápidas por proyecto

| Proyecto | Components | Services | Models | Routes | HTML | SCSS | Total archivos analizados |
|---|---:|---:|---:|---:|---:|---:|---:|
| `cocina-frontend` | 4 | 1 | 2 | 1 | 1 | 1 | 16 |
| `Frontend-inventario-actualizado` | 33 | 1 | 5 | 1 | 32 | 32 | 108 |
| `ga-web-restaurante` | 23 | 3 | 7 | 7 | 23 | 23 | 105 |
| `lib-gas-layout-frontend/projects/inventario-ui` | 3 | 0 | 0* | 0 | 3 | 5 | 14 |
| `ga-web-inicio-general` | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

\* La librería sí tiene contratos en `nav.models.ts`, pero no con sufijo `*.model.ts`.

---

## 4. Diagnóstico por proyecto

### 4.1 `ga-web-inicio-general`

**Ruta:** `C:\Users\MI PC\OneDrive\Desktop\microFrontends\ga-web-inicio-general`

#### Estado real
- Solo existe `README.md`.
- No hay `package.json`, `angular.json`, `src/`, `tsconfig`, componentes ni estilos.

#### Conclusión
Este proyecto **no aporta código migrable por ahora**. Solo aporta intención funcional: “inicio general”.

#### Acción sugerida
En el monorepo debe convertirse en:
- `feature-auth` si cubre login/recuperación
- `feature-home` o rutas públicas dentro de `feature-shell`
- `feature-notificaciones` si luego se separan panel e historial

---

### 4.2 `cocina-frontend`

**Ruta:** `C:\Users\MI PC\OneDrive\Desktop\microFrontends\cocina-frontend`

#### Estado real
- Angular 20 standalone.
- `app.routes.ts` está vacío:

```ts
export const routes: Routes = [];
```

- Estructura existente:
  - `core/guards`
  - `core/interceptors`
  - `core/models`
  - `core/services`
  - `features/ingredientes`
  - `features/menus`
  - `features/recetas`
  - `shared/components`
  - `shared/pipes`

#### Archivos detectados pero vacíos (0 bytes)
- `src/app/features/recetas/recetas.component.ts`
- `src/app/features/menus/menus.component.ts`
- `src/app/features/ingredientes/ingredientes.component.ts`
- `src/app/shared/components/navbar.component.ts`
- `src/app/core/services/receta.service.ts`

#### Modelos existentes
- `ingrediente.model.ts`
- `receta.model.ts`

#### Conclusión
Este proyecto hoy es **una base estructural, no una feature consolidada**. Sirve para rescatar naming y dominio, pero casi no aporta implementación real.

#### Destino recomendado en monorepo
- `libs/feature-cocina/models`
- `libs/feature-cocina/data-access` (solo cuando exista lógica real)
- `libs/feature-cocina/ui`

**NO conviene migrarlo “tal cual”**. Primero hay que clasificar qué existe de verdad y qué es solo scaffolding.

---

### 4.3 `ga-web-restaurante`

**Ruta:** `C:\Users\MI PC\OneDrive\Desktop\microFrontends\ga-web-restaurante`

#### Stack y forma
- Angular 20 standalone.
- Tiene layout propio compuesto por:
  - `layout/shell`
  - `layout/sidebar`
  - `layout/header`

#### Routing principal detectado
- `/dashboard`
- `/restaurante`
- `/comandas`
- `/estadisticas`
- `/facturacion`
- `/configuracion`

#### Features detectadas
- `dashboard`
- `restaurante`
- `comandas`
- `estadisticas`
- `facturacion`
- `configuracion`

#### Componentes relevantes
- Layout:
  - `ShellComponent`
  - `SidebarComponent`
  - `HeaderComponent`
- Comandas:
  - `ComandasPageComponent`
  - `ComandasFiltrosComponent`
  - `ComandasResumenComponent`
  - `ComandasTablaComponent`
- Estadísticas:
  - `EstadisticasPageComponent`
  - `EstadisticasKpisComponent`
  - `EstadisticasRendimientoComponent`
  - `EstadisticasTopMesasComponent`
  - `EstadisticasHistorialComponent`
  - `EstadisticasExportarComponent`
- Facturación:
  - `NuevaFacturaComponent`
  - `BuscarFacturaComponent`
  - `RegistrarPagoComponent`

#### Modelos detectados
- `actividad.model.ts`
- `comanda.model.ts`
- `estadisticas.model.ts`
- `mesa.model.ts`
- `nav-item.model.ts`
- `orden.model.ts`
- `user.model.ts`

#### Servicios detectados
- `auth.service.ts`
- `dashboard.service.ts`
- `estadisticas.service.ts`

#### Conclusión
Este proyecto sí tiene material migrable y se debe **partir por dominios**, no copiar carpeta por carpeta.

#### Destino recomendado en monorepo
- `layout/*` → `libs/feature-shell`
- `features/restaurante` → `libs/feature-restaurante`
- `features/comandas` → `libs/feature-restaurante` o subdominio interno
- `features/estadisticas` → `libs/feature-reportes` o `feature-restaurante` según ownership final
- `features/facturacion` → `libs/feature-facturacion`
- modelos compartibles (`mesa`, `orden`, `comanda`, `user`) → evaluar promoción a `libs/shared/models`

---

### 4.4 `Frontend-inventario-actualizado`

**Ruta:** `C:\Users\MI PC\OneDrive\Desktop\microFrontends\Frontend-inventario-actualizado`

#### Stack y forma
- Angular 20 standalone.
- Es el proyecto con mayor cantidad de pantallas útiles.
- Depende de una librería local publicada por archivo:

```json
"inventario-ui": "file:../../lib-gas-layout-frontend/dist/inventario-ui"
```

#### Routing principal detectado
- `/dashboard`
- `/bienes`
- `/bienes/exportar`
- `/bienes/importar`
- `/bienes/:id`
- `/bienes/:id/editar`
- `/facturas`
- `/facturas/:id`
- `/facturas/:id/anular`
- `/solicitudes-gil`
- `/solicitudes-gil/nueva`
- `/solicitudes-gil/:id`
- `/solicitudes-gil/:id/editar`
- `/solicitudes-gil/:id/pdf`
- `/factura-global`
- `/factura-global/nuevo`
- `/factura-global/:id`
- `/alertas`
- `/presupuesto`
- `/presupuesto/:id`

#### Features detectadas
- `dashboard`
- `bienes`
- `facturas`
- `solicitudes-gil`
- `conciliacion`
- `alertas-stock`
- `presupuesto`

#### Componentes/pantallas más relevantes
- Bienes:
  - `BienesListComponent`
  - `BienesDetailComponent`
  - `BienesEditComponent`
  - `BienesImportComponent`
  - `BienesExportComponent`
  - `BienFormModalComponent`
  - `DeleteConfirmModalComponent`
- Facturas:
  - `FacturasListComponent`
  - `FacturasDetailComponent`
  - `FacturasAnularComponent`
  - `FacturaFormModalComponent`
  - `FacturaEditModalComponent`
  - `FacturaExportModalComponent`
- Solicitudes GIL:
  - `SolicitudesGilListComponent`
  - `SolicitudesGilCreateComponent`
  - `SolicitudesGilDetailComponent`
  - `SolicitudesGilEditComponent`
  - `SolicitudesGilPdfComponent`
  - `SolicitudDeleteModalComponent`
- Conciliación / consolidado:
  - `ConciliacionListComponent`
  - `ConciliacionCreateComponent`
  - `ConciliacionDetailComponent`
  - `ExportModalComponent`
  - `ReverseModalComponent`
- Presupuesto:
  - `PresupuestoDashboardComponent`
  - `PresupuestoDetailComponent`
  - `CargarGilModalComponent`
  - `RegistrarModalComponent`
  - `ExportarReporteModalComponent`
- Alertas:
  - `AlertasStockComponent`

#### Conclusión
Este proyecto es la **fuente principal de código migrable** para:
- inventario
- facturación administrativa
- abastecimiento/GIL
- presupuesto
- alertas

#### Destino recomendado en monorepo
- `bienes` + alertas → `libs/feature-inventario`
- `facturas` → `libs/feature-facturacion`
- `solicitudes-gil` + `conciliacion` → `libs/feature-abastecimiento`
- `presupuesto` → `libs/feature-presupuesto`
- íconos/config común → `libs/shared/ui` o `libs/shared/util`

#### Observación arquitectónica importante
La pantalla raíz ya usa un layout reusable:
- `MainLayoutComponent`
- `BarraLateralConfig`
- `TopNavLink`

Eso demuestra que **ya existe un embrión de `shared/ui + feature-shell`**, solo que hoy vive fuera del repo principal deseado.

---

### 4.5 `lib-gas-layout-frontend`

**Ruta:** `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend`

#### Estado real
Workspace Angular de librería con proyecto:
- `projects/inventario-ui`

#### API pública detectada
- `MainLayoutComponent`
- `BarraLateralComponent`
- `BarraSuperiorComponent`
- `nav.models`
- `provideInventarioUi(...)`

#### Qué resuelve hoy
- Shell visual reutilizable
- Sidebar configurable por datos
- Topbar configurable
- Tokens visuales y estilos globales comunes
- Integración de iconos con Lucide

#### Conclusión
Esta librería **no debe migrarse como `feature-inventario`**. Debe partirse así:
- layout compartido → `libs/feature-shell` o `libs/shared/ui/layout`
- tokens → `libs/shared/ui/tokens`
- contratos de navegación → `libs/shared/models` o `libs/feature-shell/models`
- provider de iconos → `libs/shared/ui/icons` o `libs/shared/util/icons`

---

## 5. Inventario visual: colores, tipografías, radios, tamaños y layout

## 5.1 Fuente visual más madura

La base visual más consistente hoy está entre:
1. `lib-gas-layout-frontend/projects/inventario-ui/src/styles/_variables.scss`
2. `Frontend-inventario-actualizado/src/styles/variables.scss`

Esas dos definen el lenguaje visual más completo.

---

## 5.2 Tokens visuales detectados en inventario/layout

### Colores principales
- Primario SENA: `#39A900`
- Primario hover: `#38A800`
- Esmeralda apoyo:
  - `#10b981`
  - `#059669`
  - `#047857`
- Pizarra:
  - `#f8fafc`
  - `#f1f5f9`
  - `#e2e8f0`
  - `#cbd5e1`
  - `#94a3b8`
  - `#64748b`
  - `#475569`
  - `#334155`
  - `#1e293b`
  - `#0f172a`
- Terciario / error:
  - `#ba1830`
  - `#ff555f`
  - `#ba1a1a`

### Tipografía
- Titulares: `Manrope`
- Cuerpo: `Inter`
- Etiquetas: `Inter`

### Radios
- `0.125rem`
- `0.25rem`
- `0.5rem`
- `0.75rem`
- `1rem`
- `9999px`

### Sombras
- Baja: `0 4px 20px rgba(0,0,0,0.02)`
- Media: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`

### Layout reusable detectado
- Sidebar: `16rem` (`256px`)
- Topbar: `4rem` (`64px`)
- Contenido con `padding-top: 6rem`
- Espaciado horizontal principal: `2rem`

---

## 5.3 Sistema visual alterno detectado en `ga-web-restaurante`

`ga-web-restaurante/src/styles.scss` define otro sistema visual distinto.

### Colores principales
- Primario: `#28A745`
- Primario dark: `#1E8449`
- Primario light: `#D4EDDA`
- Estados:
  - libre `#2ECC71`
  - espera `#F39C12`
  - ocupado `#E74C3C`
  - abierto `#27AE60`
  - preparación `#E67E22`
  - pagado `#E74C3C`

### Tipografía y tamaños
- `Inter`, `Segoe UI`, sans-serif
- `11px`, `12px`, `13px`, `15px`, `22px`, `28px`

### Bordes/radios
- `6px`, `10px`, `14px`

### Layout propio
- Sidebar: `160px`
- Header: `56px`
- Content padding: `24px`

#### Diagnóstico
Acá hay una inconsistencia fuerte con inventario/layout:
- inventario/layout usa `256px / 64px`
- restaurante usa `160px / 56px`
- paletas verdes y grises distintas
- naming de tokens distinto

**Esto hay que unificar sí o sí** antes de consolidar el monorepo. Si no, el repo nace con deuda de diseño desde el día 1.

---

## 5.4 `cocina-frontend`

- `src/styles.scss` está prácticamente vacío.
- No aporta sistema visual consolidado.

#### Diagnóstico
Cocina debe **adoptar** el sistema compartido del monorepo; no hay nada serio para rescatar visualmente desde ahí.

---

## 6. Componentes compartibles detectados

## 6.1 Candidatos claros a `feature-shell` / `shared/ui`

### Desde `lib-gas-layout-frontend`
- `MainLayoutComponent`
- `BarraLateralComponent`
- `BarraSuperiorComponent`
- `BarraLateralConfig`
- `TopNavLink`
- `PerfilConfig`
- `provideInventarioUi(...)`

### Desde `ga-web-restaurante`
- `ShellComponent`
- `SidebarComponent`
- `HeaderComponent`

#### Decisión recomendada
No mantener ambos shells. Elegir **uno** como base.

### Recomendación
Usar como base el shell de `inventario-ui`, porque:
- ya es reusable por configuración
- ya está separado como librería
- ya tiene tokens más completos
- ya piensa en consumo cross-app

**Tradeoff:**
- Hay que adaptar naming y navegación de restaurante.
- Pero evita reescribir un shell desde cero.

---

## 6.2 Candidatos a `shared/models`

### Desde restaurante
- `mesa.model.ts`
- `orden.model.ts`
- `comanda.model.ts`
- `user.model.ts`

### Desde cocina
- `ingrediente.model.ts`
- `receta.model.ts`

### Desde inventario
- `bien.model.ts`
- modelos de `facturas`, `conciliacion`, `presupuesto`, `solicitudes-gil`

#### Regla recomendada
Promover a `shared/models` solo lo que cruce dominios:
- `User`
- `Rol`
- `Mesa`
- `Pedido/Orden`
- `Factura`
- `Bien`
- `PaginatedResponse / ApiResponse`

Lo específico se queda en cada feature.

---

## 7. Mapa de migración desde proyectos legacy a librerías del monorepo

| Origen actual | Destino recomendado |
|---|---|
| `lib-gas-layout-frontend/projects/inventario-ui/src/lib/main-layout` | `libs/feature-shell` o `libs/shared/ui/layout` |
| `lib-gas-layout-frontend/projects/inventario-ui/src/styles/_variables.scss` | `libs/shared/ui/tokens/_variables.scss` |
| `Frontend-inventario-actualizado/src/app/features/bienes` | `libs/feature-inventario` |
| `Frontend-inventario-actualizado/src/app/features/alertas-stock` | `libs/feature-inventario` o `feature-notificaciones` |
| `Frontend-inventario-actualizado/src/app/features/facturas` | `libs/feature-facturacion` |
| `Frontend-inventario-actualizado/src/app/features/solicitudes-gil` | `libs/feature-abastecimiento` |
| `Frontend-inventario-actualizado/src/app/features/conciliacion` | `libs/feature-abastecimiento` |
| `Frontend-inventario-actualizado/src/app/features/presupuesto` | `libs/feature-presupuesto` |
| `ga-web-restaurante/src/app/features/restaurante` | `libs/feature-restaurante` |
| `ga-web-restaurante/src/app/features/comandas` | `libs/feature-restaurante` |
| `ga-web-restaurante/src/app/features/facturacion` | `libs/feature-facturacion` |
| `ga-web-restaurante/src/app/features/estadisticas` | `libs/feature-reportes` o `feature-restaurante` |
| `cocina-frontend/src/app/features/*` | `libs/feature-cocina` (solo luego de validar qué no es stub) |
| `ga-web-inicio-general` | No migrar código; redefinir desde requerimientos |

---

## 8. Orden recomendado de organización

## Fase 1 — Congelar y clasificar
1. Congelar el código legacy por proyecto.
2. Marcar por archivo:
   - `migrar`
   - `reescribir`
   - `descartar`
3. Tomar `Frontend-inventario-actualizado` y `ga-web-restaurante` como fuentes principales.
4. Marcar `cocina-frontend` como **scaffold incompleto**.
5. Marcar `ga-web-inicio-general` como **sin base técnica**.

## Fase 2 — Extraer base compartida
1. Extraer tokens desde `inventario-ui`.
2. Extraer shell reusable desde `inventario-ui`.
3. Unificar tipografías, radios, sombras, spacing y tamaños de layout.
4. Reemplazar hardcodes de `ga-web-restaurante` por tokens comunes.

## Fase 3 — Migrar por dominio
1. `feature-shell`
2. `shared/ui`
3. `shared/models`
4. `feature-inventario`
5. `feature-facturacion`
6. `feature-abastecimiento`
7. `feature-restaurante`
8. `feature-cocina`
9. `feature-reportes`

## Fase 4 — Enforzar arquitectura
1. Crear monorepo Nx real.
2. Definir tags por scope/tipo.
3. Activar `@nx/enforce-module-boundaries`.
4. Prohibir import directo entre features.
5. Promover contratos compartidos a `shared/models`.

---

## 9. Riesgos técnicos detectados

### Riesgo 1 — Migrar por carpetas en lugar de por dominios
Si copian repos enteros dentro de `libs/`, van a llevarse acoplamiento legacy al monorepo.

### Riesgo 2 — Mantener dos sistemas visuales
Hoy inventario y restaurante no comparten tokens reales. Si no se unifica primero, el `shared/ui` va a nacer roto.

### Riesgo 3 — Tomar `cocina-frontend` como fuente madura
No lo es. Hoy contiene demasiados stubs vacíos.

### Riesgo 4 — Confundir layout reusable con feature de negocio
`inventario-ui` no es inventario como dominio; es **infraestructura visual reutilizable**.

---

## 10. Decisiones recomendadas para arrancar bien

1. **Base visual oficial:** usar `inventario-ui` como punto de partida.
2. **Shell oficial:** extraer `MainLayoutComponent`, `BarraLateralComponent` y `BarraSuperiorComponent` al monorepo.
3. **Proyecto fuente principal de negocio:** `Frontend-inventario-actualizado`.
4. **Proyecto fuente secundaria de negocio:** `ga-web-restaurante`.
5. **Proyecto a revalidar:** `cocina-frontend`.
6. **Proyecto sin código migrable:** `ga-web-inicio-general`.

---

## 11. Próximo paso concreto

Antes de mover código, conviene crear una segunda tabla por archivo o carpeta con tres estados:
- `MIGRAR DIRECTO`
- `REFACTORIZAR ANTES DE MIGRAR`
- `DESCARTAR / REESCRIBIR`

Ese documento sería el puente entre la arquitectura deseada y el trabajo real de implementación.

---

## 12. Resumen ejecutivo

- La arquitectura objetivo del monorepo está bien pensada, pero **todavía no existe en código**.
- Hoy lo real es una constelación de apps Angular separadas.
- `Frontend-inventario-actualizado` es la fuente más rica.
- `lib-gas-layout-frontend` contiene la base visual reusable más valiosa.
- `ga-web-restaurante` aporta bastante lógica y pantallas, pero con un sistema visual distinto.
- `cocina-frontend` está en estado embrionario.
- `ga-web-inicio-general` no tiene base técnica usable.
