# 🏗️ Arquitectura Frontend — Monorepo Angular 20 + Nx

> Guía de arquitectura para un equipo de 23 personas. Define la estructura, reglas de dependencia, flujo de trabajo Git, convenciones de código y asignación de ownership por dominio.

---

## Tabla de Contenido

1. [Visión General](#1-visión-general)
2. [Estructura de Carpetas](#2-estructura-de-carpetas)
3. [Capas de la Arquitectura](#3-capas-de-la-arquitectura)
   - [App Shell](#31-app-shell)
   - [Feature Shell](#32-feature-shell)
   - [Shared Layer](#33-shared-layer)
   - [Feature Layer](#34-feature-layer)
4. [Regla de Oro de Dependencias](#4-regla-de-oro-de-dependencias)
5. [Anatomía Interna de un Feature](#5-anatomía-interna-de-un-feature)
6. [Variables y Design Tokens](#6-variables-y-design-tokens)
7. [Modelos Compartidos](#7-modelos-compartidos)
8. [Componentes Compartidos vs Únicos](#8-componentes-compartidos-vs-únicos)
9. [Comunicación entre Features](#9-comunicación-entre-features)
10. [Flujo de Trabajo Git](#10-flujo-de-trabajo-git)
11. [Aplicación de Reglas con ESLint + Nx](#11-aplicación-de-reglas-con-eslint--nx)
12. [Asignación de Equipos](#12-asignación-de-equipos)
13. [Comandos Nx del Día a Día](#13-comandos-nx-del-día-a-día)
14. [CONTRIBUTING — Reglas que firma cada dev](#14-contributing--reglas-que-firma-cada-dev)

---

## 1. Visión General

El sistema se construye como un **monorepo Nx + Angular 20** con arquitectura de librerías por dominio. El principio central es:

> **Una librería = un dominio = un equipo propietario.**

Esto garantiza que los 23 desarrolladores puedan trabajar en paralelo sin colisiones, que las dependencias sean explícitas y verificadas por herramientas, y que la base de código escale sin convertirse en un monolito.

### Herramientas base

| Herramienta | Rol |
|---|---|
| **Nx** | Gestor del monorepo, caché de builds, grafos de dependencia |
| **Angular 20** | Framework de UI (standalone components por defecto) |
| **NgRx** | Gestión de estado global y por feature |
| **ESLint + `@nx/enforce-module-boundaries`** | Enforcement automático de reglas de dependencia |
| **Prettier** | Formateo de código unificado |
| **Husky + lint-staged** | Validación antes de cada commit |

---

## 2. Estructura de Carpetas

Las librerías están organizadas por **dominio de negocio**. Cada carpeta de dominio agrupa todas las features que pertenecen a ese contexto. Cuando un dominio crezca, sus nuevas features se agregan dentro de su carpeta — no en la raíz de `libs/`.

```
GastrosenaFrontend/
│
├── apps/
│   └── restaurant-app/           ← Solo main.ts + bootstrapApplication()
│                                   No contiene routing, layout, ni lógica.
│
├── libs/
│   │
│   ├── shell/                    ← Infraestructura de navegación (no es dominio de negocio)
│   │   ├── feature-shell/        ← Routing principal, layouts, guards, nav
│   │   └── feature-home/         ← Landing pública del restaurante
│   │
│   ├── auth/                     ← Dominio: identidad y acceso
│   │   ├── feature-auth/         ← Login, recuperación de contraseña
│   │   └── feature-usuarios/     ← CRUD usuarios, roles, permisos, historial
│   │
│   ├── cocina/                   ← Dominio: operaciones de cocina
│   │   └── feature-cocina/       ← Pedidos, recetas, tiempos, menús
│   │
│   ├── bar/                      ← Dominio: operaciones de bar
│   │   └── feature-bar/          ← Pedidos bar, recetas de bebidas, alertas
│   │
│   ├── restaurante/              ← Dominio: salón y servicio
│   │   └── feature-restaurante/  ← Mesas, pedidos de salón, comandas
│   │
│   ├── inventario/               ← Dominio: gestión de bienes
│   │   └── feature-inventario/   ← Bienes, entradas/salidas, stock, conciliación
│   │
│   ├── abastecimiento/           ← Dominio: abastecimiento y GIL
│   │   └── feature-abastecimiento/ ← GIL-F-014, consolidados, paquete probatorio
│   │
│   ├── facturacion/              ← Dominio: facturación electrónica
│   │   └── feature-facturacion/  ← FEL, CUFE, ciclo de vida de facturas
│   │
│   ├── presupuesto/              ← Dominio: presupuesto y ZESE
│   │   └── feature-presupuesto/  ← Techos presupuestales, ejecución
│   │
│   ├── requisiciones/            ← Dominio: requisiciones y actas
│   │   └── feature-requisiciones/ ← Requisiciones diarias, actas de legalización
│   │
│   ├── reportes/                 ← Dominio: reportería
│   │   └── feature-reportes/     ← Reportes exportables (PDF/Excel)
│   │
│   ├── notificaciones/           ← Dominio: alertas y notificaciones
│   │   └── feature-notificaciones/ ← Panel, historial, alertas de stock en tiempo real
│   │
│   └── shared/                   ← Código reutilizable cross-dominio
│       ├── auth/                 ← AuthService, guards de sesión, current-user signal
│       ├── api/                  ← BaseHttpService, interceptores, error handling
│       ├── state/                ← NgRx root store, metareducers globales
│       ├── ui/                   ← Design system: botones, tablas, modales, tokens
│       ├── util/                 ← Pipes, validators, formatters, constantes
│       └── models/               ← Interfaces globales (Usuario, Rol, Paginacion...)
│
├── remotes/                      ← Proyectos standalone de referencia (no son parte del monorepo)
│
├── .eslintrc.json                ← Reglas de módulos (enforce-module-boundaries)
├── nx.json                       ← Configuración Nx y caché
├── tsconfig.base.json            ← Path aliases para todas las librerías
├── SETUP.md                      ← Cómo instalar, correr y contribuir al proyecto
└── CONTRIBUTING.md               ← Reglas de trabajo (ver sección 14)
```

> **Convención de crecimiento:** cuando un dominio necesite una segunda feature (ej. `feature-cocina-recetas`), se crea dentro de `libs/cocina/feature-cocina-recetas/` — nunca en la raíz de `libs/`.

---

## 3. Capas de la Arquitectura

### 3.1 App Shell

```
apps/restaurant-app/
  └── src/
      ├── main.ts          ← bootstrapApplication(AppComponent, appConfig)
      └── app/
          ├── app.component.ts    ← <router-outlet> únicamente
          └── app.config.ts       ← provideRouter, provideHttpClient, provideStore
```

La app shell **no contiene** routing, guards, layouts ni lógica de negocio. Su único rol es arrancar la aplicación y proveer los servicios raíz. Todo lo demás vive en librerías testeables.

---

### 3.2 Feature Shell

```
libs/feature-shell/
  └── src/lib/
      ├── shell.routes.ts        ← Rutas principales con lazy loading
      ├── shell-layout/
      │   ├── shell-layout.component.ts   ← Sidebar, topbar, área de contenido
      │   └── shell-layout.component.html
      ├── guards/
      │   ├── auth.guard.ts      ← Redirige a /login si no hay sesión
      │   └── role.guard.ts      ← Controla acceso por rol (Administrador, Chef...)
      └── nav/
          └── nav-config.ts      ← Definición del menú por rol
```

**Por qué separar el shell en una librería:**

- Es completamente testeable con `TestBed` sin levantar la app entera.
- El routing no contamina `main.ts`.
- Los guards de alto nivel están centralizados y no duplicados en cada feature.
- El equipo de arquitectura puede modificar el layout sin tocar ningún feature.

**Ejemplo de `shell.routes.ts`:**

```typescript
export const shellRoutes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'cocina',
        canActivate: [roleGuard(['CHEF', 'ADMIN_COCINA', 'AUXILIAR_COCINA'])],
        loadChildren: () =>
          import('@restaurant/feature-cocina').then(m => m.COCINA_ROUTES),
      },
      {
        path: 'bar',
        canActivate: [roleGuard(['LIDER_BAR', 'ADMIN_BAR', 'BARTENDER'])],
        loadChildren: () =>
          import('@restaurant/feature-bar').then(m => m.BAR_ROUTES),
      },
      {
        path: 'inventario',
        canActivate: [roleGuard(['ADMINISTRADOR', 'CONTADORA'])],
        loadChildren: () =>
          import('@restaurant/feature-inventario').then(m => m.INVENTARIO_ROUTES),
      },
      // ... demás features
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@restaurant/feature-auth').then(m => m.AUTH_ROUTES),
  },
];
```

---

### 3.3 Shared Layer

La capa compartida está **dividida en 6 librerías especializadas** para evitar un monolito. Cada una tiene un propósito único y acotado.

#### `shared/auth`

Responsabilidad única: identidad y autorización.

```
shared/auth/src/lib/
  ├── auth.service.ts           ← Login, logout, refresh token
  ├── jwt.interceptor.ts        ← Adjunta Bearer token a cada request
  ├── auth.guard.ts             ← Verifica sesión activa
  ├── role.guard.ts             ← Verifica rol requerido
  ├── current-user.signal.ts    ← Signal con el usuario autenticado
  └── auth.models.ts            ← LoginRequest, LoginResponse, TokenPayload
```

#### `shared/api`

Responsabilidad única: comunicación HTTP.

```
shared/api/src/lib/
  ├── base-http.service.ts      ← Wrapper de HttpClient con manejo de errores
  ├── error.interceptor.ts      ← Captura errores HTTP, emite notificaciones
  ├── loading.interceptor.ts    ← Activa/desactiva indicador global de carga
  ├── api-config.token.ts       ← InjectionToken para la URL base del API
  └── api-response.model.ts     ← ApiResponse<T>, PaginatedResponse<T>
```

#### `shared/state`

Responsabilidad única: estado global NgRx.

```
shared/state/src/lib/
  ├── app.state.ts              ← Interfaz raíz AppState
  ├── router/
  │   └── router.selectors.ts   ← Selectores del router store
  ├── ui/
  │   ├── ui.reducer.ts         ← isLoading, sidebarOpen, activeTheme
  │   └── ui.selectors.ts
  └── metareducers/
      └── hydration.metareducer.ts  ← Persistencia en localStorage
```

> El estado **específico de cada feature** (pedidos de cocina, bienes del inventario) vive en `feature-*/data-access/`, no aquí. En `shared/state` solo va el estado verdaderamente global.

#### `shared/ui`

Responsabilidad única: sistema de diseño visual.

```
shared/ui/src/lib/
  ├── tokens/
  │   ├── _variables.scss       ← Design tokens (ver sección 6)
  │   └── index.scss
  ├── components/
  │   ├── data-table/
  │   ├── status-badge/
  │   ├── confirm-dialog/
  │   ├── page-header/
  │   ├── search-filter/
  │   ├── loading-skeleton/
  │   ├── empty-state/
  │   └── export-button/        ← Botón PDF/Excel usado en reportes e inventario
  └── directives/
      ├── has-role.directive.ts  ← *hasRole="['CHEF', 'ADMIN']"
      └── auto-focus.directive.ts
```

#### `shared/util`

Responsabilidad única: funciones puras y sin estado.

```
shared/util/src/lib/
  ├── pipes/
  │   ├── currency-cop.pipe.ts   ← Formato moneda colombiana
  │   ├── date-co.pipe.ts        ← Formato fecha Colombia
  │   └── estado-pedido.pipe.ts  ← EstadoPedido → label legible
  ├── validators/
  │   ├── cufe.validator.ts      ← Valida 64 caracteres SHA-256
  │   └── nit.validator.ts       ← Valida formato NIT colombiano
  └── formatters/
      ├── iva.calculator.ts      ← Cálculos IVA 0%, 5%, 19%
      └── zese.calculator.ts     ← Retención ZESE 0.625%
```

#### `shared/models`

Responsabilidad única: contratos de datos compartidos entre features.

```
shared/models/src/lib/
  ├── usuario.model.ts          ← Usuario, Rol (enum)
  ├── pedido.model.ts           ← Pedido, PedidoItem, EstadoPedido (enum)
  ├── bien.model.ts             ← Bien, UnidadMedida, EstadoStock (enum)
  ├── factura.model.ts          ← Factura, EstadoFactura (enum), CUFE
  ├── pagination.model.ts       ← PaginatedResponse<T>, PageRequest
  └── api-response.model.ts     ← ApiResponse<T>
```

---

### 3.4 Feature Layer

Cada librería de feature tiene la misma anatomía interna de cuatro sublibrerías. La consistencia entre features es lo que permite que cualquier dev pueda moverse entre dominios sin curva de aprendizaje.

```
feature-cocina/
  ├── ui/              ← Componentes visuales exclusivos de cocina
  ├── data-access/     ← Services, NgRx Store+Effects propios de cocina
  ├── util/            ← Helpers específicos de cocina (no van a shared)
  └── models/          ← Interfaces propias (RecetaCocina, TiempoPreparacion...)
```

Regla: si una interfaz de `feature-cocina/models` empieza a ser necesaria en `feature-restaurante`, se **promueve** a `shared/models`. Nunca se importa entre features directamente.

---

## 4. Regla de Oro de Dependencias

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  feature-*   →  puede importar de  shared/*         │
│  feature-*   →  NUNCA importa de otro  feature-*    │
│  shared/*    →  NUNCA importa de  feature-*         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Dentro de `shared/`, el orden jerárquico es:

```
shared/ui       → puede importar: shared/models, shared/util
shared/auth     → puede importar: shared/models, shared/api
shared/api      → puede importar: shared/models
shared/state    → puede importar: shared/models, shared/auth
shared/util     → puede importar: shared/models
shared/models   → NO importa nada (es la capa base)
```

Esta jerarquía se enforza automáticamente con ESLint (ver sección 11).

---

## 5. Anatomía Interna de un Feature

Tomando `feature-inventario` como ejemplo completo:

```
libs/feature-inventario/
│
├── ui/
│   └── src/lib/
│       ├── catalog/
│       │   ├── catalog-list.component.ts
│       │   └── catalog-filter.component.ts
│       ├── stock/
│       │   ├── stock-alert-banner.component.ts    ← Solo existe en inventario
│       │   └── stock-level-indicator.component.ts
│       ├── movements/
│       │   ├── entry-form.component.ts
│       │   └── exit-form.component.ts
│       └── index.ts   ← Barrel: exporta solo lo público
│
├── data-access/
│   └── src/lib/
│       ├── +state/
│       │   ├── inventario.actions.ts
│       │   ├── inventario.reducer.ts
│       │   ├── inventario.effects.ts
│       │   ├── inventario.selectors.ts
│       │   └── inventario.facade.ts    ← El único punto de entrada al store
│       ├── services/
│       │   ├── bienes.service.ts
│       │   ├── movimientos.service.ts
│       │   └── alertas-stock.service.ts
│       └── index.ts
│
├── util/
│   └── src/lib/
│       ├── stock-level.calculator.ts   ← Lógica específica de umbrales
│       └── bien-code.generator.ts      ← Generador de códigos SENA internos
│
└── models/
    └── src/lib/
        ├── bien.model.ts               ← Extiende shared/models Bien si hace falta
        ├── movimiento.model.ts
        ├── alerta-stock.model.ts
        └── index.ts
```

**El Facade** (`inventario.facade.ts`) es el patrón clave: los componentes de `ui/` solo hablan con el facade, nunca con el store directamente. Esto hace que los componentes sean más testeables y desacoplados.

```typescript
// inventario.facade.ts
@Injectable({ providedIn: 'root' })
export class InventarioFacade {
  bienes$         = this.store.select(selectAllBienes);
  bienesEnAlerta$ = this.store.select(selectBienesEnAlerta);
  isLoading$      = this.store.select(selectInventarioLoading);

  constructor(private store: Store) {}

  cargarBienes(filtros?: BienFiltro)  { this.store.dispatch(InventarioActions.cargarBienes({ filtros })); }
  registrarEntrada(entrada: Entrada)  { this.store.dispatch(InventarioActions.registrarEntrada({ entrada })); }
  registrarSalida(salida: Salida)     { this.store.dispatch(InventarioActions.registrarSalida({ salida })); }
}
```

---

## 6. Variables y Design Tokens

Todos los tokens viven en `libs/shared/ui/src/lib/tokens/_variables.scss`. **Nadie define colores, espaciados ni tipografía fuera de este archivo.**

```scss
// ─── Paleta base ──────────────────────────────────────────────────────────────
:root {
  // Colores por rol de usuario (usados en badges, navs, indicadores)
  --color-rol-administrador:    #6C5CE7;
  --color-rol-contadora:        #A29BFE;
  --color-rol-instructor:       #0984E3;
  --color-rol-chef:             #E17055;
  --color-rol-lider-bar:        #00B894;
  --color-rol-mesero:           #FDCB6E;
  --color-rol-bartender:        #55EFC4;
  --color-rol-auxiliar:         #B2BEC3;
  --color-rol-cajero:           #FD79A8;

  // Estados de pedido (semánticos, consistentes en cocina, bar y restaurante)
  --color-estado-espera:        #FDCB6E;
  --color-estado-preparacion:   #0984E3;
  --color-estado-listo:         #00B894;
  --color-estado-entregado:     #636E72;
  --color-estado-cancelado:     #D63031;

  // Estados de documentos (GIL, Factura, Acta, Requisición)
  --color-doc-borrador:         #B2BEC3;
  --color-doc-pendiente:        #FDCB6E;
  --color-doc-validado:         #74B9FF;
  --color-doc-aprobado:         #00B894;
  --color-doc-procesado:        #636E72;
  --color-doc-anulado:          #D63031;

  // Semánticos de UI
  --color-success:              #00B894;
  --color-warning:              #FDCB6E;
  --color-danger:               #D63031;
  --color-info:                 #0984E3;

  // Superficies
  --color-surface-primary:      #FFFFFF;
  --color-surface-secondary:    #F8F9FA;
  --color-surface-tertiary:     #F1F3F5;
  --color-border:               #DEE2E6;
  --color-border-strong:        #ADB5BD;

  // Texto
  --color-text-primary:         #2D3436;
  --color-text-secondary:       #636E72;
  --color-text-disabled:        #B2BEC3;

  // ─── Espaciado (escala de 4px) ────────────────────────────────────────────
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;

  // ─── Tipografía ───────────────────────────────────────────────────────────
  --font-family-base:  'Inter', 'Segoe UI', system-ui, sans-serif;
  --font-family-mono:  'JetBrains Mono', 'Fira Code', monospace;

  --font-size-xs:   11px;
  --font-size-sm:   13px;
  --font-size-md:   15px;
  --font-size-lg:   18px;
  --font-size-xl:   22px;
  --font-size-2xl:  28px;

  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold:600;

  --line-height-tight:  1.3;
  --line-height-base:   1.6;
  --line-height-loose:  1.8;

  // ─── Bordes y radio ───────────────────────────────────────────────────────
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-pill: 999px;

  // ─── Sombras ──────────────────────────────────────────────────────────────
  --shadow-xs:     0 1px 3px rgba(0,0,0,.06);
  --shadow-sm:     0 2px 6px rgba(0,0,0,.08);
  --shadow-md:     0 4px 12px rgba(0,0,0,.10);
  --shadow-lg:     0 8px 24px rgba(0,0,0,.12);
  --shadow-modal:  0 16px 48px rgba(0,0,0,.18);

  // ─── Z-index (declarados para evitar guerras de z-index) ─────────────────
  --z-base:      0;
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-toast:     500;
  --z-tooltip:   600;

  // ─── Transiciones ─────────────────────────────────────────────────────────
  --transition-fast:   150ms ease;
  --transition-base:   250ms ease;
  --transition-slow:   400ms ease;

  // ─── Layout ───────────────────────────────────────────────────────────────
  --sidebar-width:       240px;
  --topbar-height:       60px;
  --content-max-width:   1280px;
}

// Modo oscuro
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface-primary:   #1A1D21;
    --color-surface-secondary: #212529;
    --color-surface-tertiary:  #2D3035;
    --color-border:            #373B40;
    --color-border-strong:     #4A4F55;
    --color-text-primary:      #E9ECEF;
    --color-text-secondary:    #ADB5BD;
    --color-text-disabled:     #6C757D;
  }
}
```

---

## 7. Modelos Compartidos

Las interfaces en `shared/models` son la **fuente de verdad única** para tipos que cruzan dominios. Nadie las redefine en su feature.

```typescript
// shared/models/src/lib/usuario.model.ts
export enum Rol {
  ADMINISTRADOR    = 'ADMINISTRADOR',
  CONTADORA        = 'CONTADORA',
  INSTRUCTOR       = 'INSTRUCTOR',
  CHEF             = 'CHEF',
  LIDER_BAR        = 'LIDER_BAR',
  MESERO           = 'MESERO',
  BARTENDER        = 'BARTENDER',
  AUXILIAR_COCINA  = 'AUXILIAR_COCINA',
  CAJERO           = 'CAJERO',
}

export interface Usuario {
  id:           string;
  nombre:       string;
  email:        string;
  rol:          Rol;
  activo:       boolean;
  creadoEn:     Date;
}

// shared/models/src/lib/pedido.model.ts
export enum EstadoPedido {
  ESPERA       = 'ESPERA',
  PREPARACION  = 'PREPARACION',
  LISTO        = 'LISTO',
  ENTREGADO    = 'ENTREGADO',
  CANCELADO    = 'CANCELADO',
}

export interface PedidoItem {
  productoId:   string;
  nombre:       string;
  cantidad:     number;
  precioUnit:   number;
  observacion?: string;
}

export interface Pedido {
  id:           string;
  numero:       number;
  mesaId:       string;
  meseroId:     string;
  estado:       EstadoPedido;
  destino:      'COCINA' | 'BAR';
  horaCreacion: Date;
  items:        PedidoItem[];
  total:        number;
}

// shared/models/src/lib/pagination.model.ts
export interface PageRequest {
  page:     number;
  size:     number;
  sortBy?:  string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content:       T[];
  totalElements: number;
  totalPages:    number;
  currentPage:   number;
  size:          number;
}

export interface ApiResponse<T> {
  data:      T;
  message:   string;
  timestamp: string;
  success:   boolean;
}
```

**Regla de promoción:** si una interfaz definida en `feature-*/models` es necesaria en más de un feature, se abre un PR para moverla a `shared/models`. Nunca se importa entre features directamente.

---

## 8. Componentes Compartidos vs Únicos

### Regla de las 3 instancias

Un componente sube a `shared/ui` únicamente cuando **3 o más features distintas lo necesitan**. Antes de eso, vive en el `feature-*/ui` que lo originó.

```
✅ shared/ui — usados por 3+ features
  DataTableComponent          (Inventario, Reportes, Usuarios, Facturación...)
  StatusBadgeComponent        (Cocina, Bar, Restaurante)
  ConfirmDialogComponent      (Todo el sistema)
  PageHeaderComponent         (Todas las vistas)
  SearchFilterComponent       (Inventario, Reportes, Usuarios)
  LoadingSkeletonComponent    (Todo el sistema)
  EmptyStateComponent         (Todo el sistema)
  ExportButtonComponent       (Reportes, Inventario, Facturación)

✅ feature-cocina/ui — únicos de cocina
  KitchenBoardComponent       (Tablero de pedidos en tiempo real)
  OrderTimerComponent         (Contador de tiempo por pedido)
  RecipeStepsComponent        (Pasos de preparación)

✅ feature-bar/ui — únicos de bar
  DrinkQueueComponent         (Cola de bebidas)
  BarStatsComponent           (Estadísticas de tiempos del bar)

✅ feature-inventario/ui — únicos de inventario
  StockAlertBannerComponent   (Alerta visual de stock crítico)
  StockLevelIndicatorComponent
  BienDetailCardComponent

✅ feature-abastecimiento/ui — únicos de GIL/abastecimiento
  GilFormComponent
  ConsolidadoTableComponent
  PaqueteProbatorioStatusComponent
```

---

## 9. Comunicación entre Features

Los features **nunca se llaman entre sí directamente**. Existen tres mecanismos válidos para la comunicación inter-feature:

### Mecanismo 1: Estado compartido en `shared/state`

Para datos que múltiples features leen pero ninguna posee.

```typescript
// shared/state/src/lib/ui/ui.actions.ts
export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Set Loading': props<{ loading: boolean }>(),
    'Show Toast':  props<{ message: string; type: 'success' | 'error' | 'info' }>(),
  }
});
```

Cocina dispara `UiActions.showToast` cuando un pedido está listo. El shell lo escucha y muestra la notificación. Cocina no sabe nada del mecanismo de notificación.

### Mecanismo 2: Facade en `feature-shell`

Para coordinación de alto nivel entre features.

```typescript
// feature-shell/src/lib/app.facade.ts
@Injectable({ providedIn: 'root' })
export class AppFacade {
  // Orquesta flujos que involucran múltiples features
  // Ej: cuando un pedido pasa a LISTO, notifica al mesero y actualiza el estado de la mesa
  pedidoListo(pedidoId: string): void {
    this.store.dispatch(PedidosActions.marcarListo({ pedidoId }));
    this.store.dispatch(NotificacionesActions.enviarAlerta({ pedidoId }));
  }
}
```

### Mecanismo 3: Eventos vía Router

Para navegación entre dominios.

```typescript
// En feature-restaurante, al cerrar la mesa:
this.router.navigate(['/facturacion', mesaId]);
// feature-facturacion lee el parámetro y carga los datos.
// Los features nunca se importan entre sí.
```

---

## 10. Flujo de Trabajo Git

### Estrategia de ramas

```
main                          ← Producción. Solo recibe merges desde develop vía PR aprobado.
  └── develop                 ← Integración. Base para todas las ramas de feature.
        ├── feat/shell/nav-por-rol
        ├── feat/cocina/kitchen-board-RF-C4.0
        ├── feat/cocina/recipe-management-RF-C4.2
        ├── feat/bar/orders-display-RF-C4.10
        ├── feat/inventario/stock-alerts-RF5.6
        ├── feat/abastecimiento/gil-form-RF5.3
        ├── fix/shared/ui/data-table-pagination
        └── chore/shared/models/add-factura-model
```

### Convención de nombres de rama

```
{tipo}/{scope}/{descripcion-corta}[-{ID_RF_opcional}]

tipo:  feat | fix | chore | refactor | test | docs
scope: shell | auth | cocina | bar | restaurante | inventario |
       usuarios | reportes | facturacion | abastecimiento |
       presupuesto | requisiciones | shared
```

### Reglas de PR

| Regla | Detalle |
|---|---|
| **Máximo 400 líneas** por PR | Si es mayor, se divide. Sin excepciones. |
| **Un scope por PR** | Un PR no puede tocar `feature-cocina` y `feature-bar` al mismo tiempo |
| **Tests obligatorios** | Todo componente nuevo lleva su `.spec.ts` |
| **`nx affected:lint` verde** | Requisito antes de abrir el PR |
| **`nx affected:test` verde** | Requisito antes de abrir el PR |
| **2 aprobaciones** | Al menos 1 del tech lead del equipo propietario del scope |
| **No self-merge** | Quien abre el PR no puede aprobarlo ni mergearlo |

### Flujo completo de un PR

```
1. git checkout develop && git pull
2. git checkout -b feat/cocina/recipe-card-RF-C4.2.1
3. ... desarrollo ...
4. nx affected:lint --base=develop    ← debe pasar
5. nx affected:test --base=develop    ← debe pasar
6. git push origin feat/cocina/recipe-card-RF-C4.2.1
7. Abrir PR → develop
8. Revisión de 2 personas (1 del equipo cocina)
9. Squash merge con mensaje: "feat(cocina): add recipe card component [RF-C4.2.1]"
```

---

## 11. Aplicación de Reglas con ESLint + Nx

Las reglas de dependencia se verifican **automáticamente en cada commit y CI**. No son sugerencias.

### Tags por proyecto (`project.json`)

```json
// libs/feature-cocina/ui/project.json
{ "tags": ["scope:cocina", "type:ui"] }

// libs/feature-cocina/data-access/project.json
{ "tags": ["scope:cocina", "type:data-access"] }

// libs/shared/ui/project.json
{ "tags": ["scope:shared", "type:ui"] }

// libs/shared/models/project.json
{ "tags": ["scope:shared", "type:models"] }

// libs/feature-shell/project.json
{ "tags": ["scope:shell", "type:feature"] }
```

### Reglas en `.eslintrc.json`

```json
{
  "@nx/enforce-module-boundaries": ["error", {
    "enforceBuildableLibDependency": true,
    "depConstraints": [
      {
        "sourceTag": "scope:cocina",
        "onlyDependOn": ["scope:shared", "scope:cocina"]
      },
      {
        "sourceTag": "scope:bar",
        "onlyDependOn": ["scope:shared", "scope:bar"]
      },
      {
        "sourceTag": "scope:restaurante",
        "onlyDependOn": ["scope:shared", "scope:restaurante"]
      },
      {
        "sourceTag": "scope:inventario",
        "onlyDependOn": ["scope:shared", "scope:inventario"]
      },
      {
        "sourceTag": "scope:facturacion",
        "onlyDependOn": ["scope:shared", "scope:facturacion"]
      },
      {
        "sourceTag": "scope:abastecimiento",
        "onlyDependOn": ["scope:shared", "scope:abastecimiento"]
      },
      {
        "sourceTag": "scope:presupuesto",
        "onlyDependOn": ["scope:shared", "scope:presupuesto"]
      },
      {
        "sourceTag": "scope:requisiciones",
        "onlyDependOn": ["scope:shared", "scope:requisiciones"]
      },
      {
        "sourceTag": "scope:usuarios",
        "onlyDependOn": ["scope:shared", "scope:usuarios"]
      },
      {
        "sourceTag": "scope:reportes",
        "onlyDependOn": ["scope:shared", "scope:reportes"]
      },
      {
        "sourceTag": "scope:auth",
        "onlyDependOn": ["scope:shared", "scope:auth"]
      },
      {
        "sourceTag": "scope:shell",
        "onlyDependOn": ["scope:shared", "scope:*"]
      },
      {
        "sourceTag": "scope:shared",
        "onlyDependOn": ["scope:shared"]
      },
      {
        "sourceTag": "type:ui",
        "onlyDependOn": ["type:ui", "type:util", "type:models"]
      },
      {
        "sourceTag": "type:data-access",
        "onlyDependOn": ["type:data-access", "type:util", "type:models"]
      },
      {
        "sourceTag": "type:util",
        "onlyDependOn": ["type:util", "type:models"]
      },
      {
        "sourceTag": "type:models",
        "onlyDependOn": ["type:models"]
      }
    ]
  }]
}
```

Si alguien de `feature-cocina` intenta importar algo de `feature-inventario`, el linter falla con:

```
A project tagged with "scope:cocina" can only depend on
projects tagged with "scope:shared" or "scope:cocina".
```

---

## 12. Asignación de Equipos

Con 23 personas y la estructura de librerías definida:

| Equipo | Librerías bajo su ownership | Personas | RF relacionados |
|---|---|---|---|
| **Arquitectura + Shell** | `apps/restaurant-app`, `feature-shell`, `shared/*` | 3 | RF1.x, RF2.x (base) |
| **Auth + Usuarios** | `feature-auth`, `feature-usuarios` | 2 | RF1.2–1.4, RF2.x |
| **Restaurante** | `feature-restaurante` | 3 | RF3.x completo |
| **Cocina** | `feature-cocina` | 2 | RF-C 4.0–4.9 |
| **Bar** | `feature-bar` | 2 | RF-C 4.10–4.19 |
| **Inventario** | `feature-inventario` | 3 | RF-5.1, RF-5.5, RF-5.6, RF-5.8 |
| **Abastecimiento** | `feature-abastecimiento` | 3 | RF-5.2–5.4, RF-5.9–5.11 |
| **Presupuesto** | `feature-presupuesto` | 1 | RF-5.7 |
| **Reportes** | `feature-reportes` | 2 | RF6.x completo |
| **QA + DevOps** | Transversal (CI, coverage, E2E) | 2 | Todos |

> El equipo de **Arquitectura** tiene veto en cambios a `shared/*`. Cualquier PR que modifique librerías compartidas requiere su aprobación.

---

## 13. Comandos Nx del Día a Día

```bash
# Crear una nueva feature dentro del dominio cocina
nx g @nx/angular:library feature-cocina-recetas \
  --directory=libs/cocina/feature-cocina-recetas \
  --tags="scope:cocina,type:feature" \
  --standalone \
  --importPath="@restaurant/feature-cocina-recetas"

# Crear una nueva librería de UI para el dominio cocina
nx g @nx/angular:library ui \
  --directory=libs/cocina/feature-cocina/ui \
  --tags="scope:cocina,type:ui" \
  --standalone \
  --importPath="@restaurant/feature-cocina/ui"

# Correr solo los tests afectados por mis cambios (no todo el monorepo)
nx affected:test --base=develop

# Lint solo de lo afectado
nx affected:lint --base=develop

# Build solo de lo que cambió
nx affected:build --base=develop

# Ver el grafo de dependencias (detecta acoplamientos no deseados)
nx graph

# Correr los tests de un proyecto específico
nx test feature-cocina-ui

# Correr en watch mode durante desarrollo
nx test feature-cocina-data-access --watch

# Ver qué proyectos se ven afectados por mis cambios actuales
nx affected:apps --base=develop
nx affected:libs --base=develop

# Formatear todo el código
nx format:write
```

---

## 14. CONTRIBUTING — Reglas que firma cada dev

Antes de hacer el primer commit, cada desarrollador confirma haber leído y entender las siguientes reglas. El incumplimiento bloquea el PR.

### Reglas de arquitectura

1. **No importar de otro `feature-*` directamente.** Si necesitas algo de otro dominio, sube al estado compartido o habla con el equipo de Arquitectura.
2. **No importar de `feature-*` dentro de `shared/`.** El flujo de dependencias es unidireccional: features dependen de shared, nunca al revés.
3. **No redefinir interfaces que existen en `shared/models/`.** Si necesitas extender, usa `extends`. Si necesitas un campo nuevo, abre un PR a `shared/models`.
4. **No definir colores, espaciados ni tipografía** fuera de `libs/shared/ui/src/lib/tokens/_variables.scss`.

### Reglas de Git

5. **Formato de rama obligatorio:** `{tipo}/{scope}/{descripcion}`. Ejemplo: `feat/cocina/order-timer-RF-C4.3`.
6. **Un scope por PR.** Si el cambio toca dos dominios, son dos PRs.
7. **Máximo 400 líneas por PR.** Sin excepciones.
8. **Correr antes de abrir el PR:**
   ```bash
   nx affected:lint --base=develop   # debe ser 0 errores
   nx affected:test --base=develop   # debe ser 0 fallos
   ```
9. **No self-merge.** Quien abre el PR no puede aprobarlo.
10. **Mensaje de commit en formato Conventional Commits:**
    ```
    feat(cocina): add order timer component [RF-C4.3.1]
    fix(shared/ui): correct table pagination on mobile
    chore(models): promote RecetaItem to shared/models
    ```

### Reglas de calidad

11. **Todo componente nuevo lleva su `.spec.ts`** con al menos un test de renderizado y uno de comportamiento.
12. **Todo servicio nuevo lleva su `.spec.ts`** con los métodos públicos cubiertos.
13. **Coverage mínimo:** 70% por librería. El CI rechaza PRs que lo bajen.
14. **No `any` en TypeScript.** Usa tipos genéricos o `unknown` con type guard.
15. **No estilos inline en templates.** Todo va en el archivo `.scss` del componente o en los tokens.

---

*Documento mantenido por el equipo de Arquitectura. Para proponer cambios a esta guía, abrir un PR con el scope `chore/docs`.*
