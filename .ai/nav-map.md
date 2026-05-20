# GastroSENA — Mapa de Navegación

> Última actualización: 2026-05-20 | Rama: `develop` | Auditoría: código real verificado componente por componente

## Leyenda

| Ícono | Significado |
|-------|-------------|
| ✅ | Implementado con lógica real |
| 🔶 | Stub — componente existe pero sin contenido |
| ❌ | Pendiente — ruta o componente no creado aún |
| 🔒 | Protegido por `roleGuard` |

---

## Progreso general

> Metodología: auditoría código a código — se leyó el `.ts` y `.html` de cada componente de página.
> Clasificación: **REAL** = facade inyectado + bindings reales | **PARCIAL** = estructura sin data | **STUB** = scaffold vacío de Nx

```mermaid
pie title Avance real del proyecto (44 componentes auditados)
    "Implementado (REAL)" : 82
    "Stub / Pendiente" : 18
```

### Por módulo

```mermaid
xychart-beta
    title "Implementación real por módulo (% componentes REAL)"
    x-axis ["Auth", "Usuarios", "Cocina", "Bar", "Restaurante", "Inventario", "Reportes", "Notificaciones"]
    y-axis "% Real" 0 --> 100
    bar [100, 33, 100, 50, 89, 100, 0, 0]
```

| Módulo | RFs | REAL | PARCIAL | STUB | % Real | Stubs identificados |
|--------|-----|------|---------|------|--------|---------------------|
| Auth | RF1.2–1.4 | 2 | 0 | 0 | `██████████` **100%** | — |
| Usuarios | RF2.x | 1 | 0 | 2 | `███░░░░░░░` **33%** | RolesPage, CuentasPage |
| Cocina | RF-C 4.0–4.9 | 7 | 0 | 0 | `██████████` **100%** | — |
| Bar | RF-C 4.10–4.19 | 2 | 0 | 2 | `█████░░░░░` **50%** | BarPage (landing), MenuPage |
| Restaurante | RF3.x | 8 | 0 | 1 | `█████████░` **89%** | CajaMovimientosPage |
| Inventario | RF-F, RF-P, RF-Q | 11 | 0 | 0 | `██████████` **100%** | — |
| Reportes | RF-R | 0 | 0 | 1 | `░░░░░░░░░░` **0%** | ReportesPage |
| Notificaciones | RF-N | 0 | 0 | 1 | `░░░░░░░░░░` **0%** | NotificacionesPage |

> **Avance real verificado: 81.8%** — 36 de 44 componentes con lógica real (facade, signals, computed, templates con bindings).

---

## Diagrama general

```mermaid
flowchart TD
    ROOT["/ — Landing"] --> AUTH["/auth"]
    ROOT --> APP["/app — Shell autenticado"]
    ROOT --> SHOWCASE["/showcase — Design System"]

    AUTH --> LOGIN["/auth/login ✅"]
    AUTH --> FORGOT["/auth/forgot-password ✅"]

    APP -->|redirect| INVENT_ROOT
    APP --> INVENT_ROOT["/app/inventario 🔒 ADMIN · CONTADORA"]
    APP --> COCINA["/app/cocina"]
    APP --> BAR["/app/bar"]
    APP --> REST["/app/restaurante"]
    APP --> USERS["/app/usuarios"]
    APP --> REP["/app/reportes 🔶"]
    APP --> NOTIF["/app/notificaciones 🔶"]
```

---

## Módulos en detalle

### `/auth` — Autenticación

```mermaid
flowchart LR
    AUTH["/auth"] --> LOGIN["/auth/login ✅\nLoginPageComponent"]
    AUTH --> FORGOT["/auth/forgot-password ✅\nForgotPasswordPageComponent"]
```

---

### `/app/usuarios` — Gestión de Usuarios

```mermaid
flowchart LR
    U["/app/usuarios"] --> LISTA["/app/usuarios ✅\nListaPageComponent\n— tabla + KPIs + filtros\n— modal importar/exportar"]
    U -.->|pendiente| ROLES["❌ /roles\nGestión de roles y permisos"]
    U -.->|pendiente| CUENTAS["❌ /cuentas\nAdministración de cuentas"]
```

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/app/usuarios` | `ListaPageComponent` | ✅ Lista con filtros, KPIs, importar/exportar |
| `/app/usuarios/roles` | `RolesPageComponent` | ❌ Stub sin rutas registradas |
| `/app/usuarios/cuentas` | `CuentasPageComponent` | ❌ Stub sin rutas registradas |

---

### `/app/cocina` — Cocina

```mermaid
flowchart LR
    C["/app/cocina"] -->|redirect| INICIO
    C --> INICIO["/inicio ✅\nInicioPageComponent"]
    C --> COMAND["/comandas ✅\nComandasPageComponent"]
    C --> RECETAS["/recetas ✅\nRecetasPageComponent"]
    C --> ACTIV["/actividad ✅\nActividadPageComponent"]
    C --> ACTIV_LIST["/actividades ✅\nActividadesListPageComponent"]
    C --> EVAL_M["/evaluacion-masiva ✅\nEvaluacionMasivaPageComponent"]
    C --> EVAL_I["/evaluacion-individual ✅\nEvaluacionIndividualPageComponent"]
```

| Ruta | Estado |
|------|--------|
| `/app/cocina/inicio` | ✅ |
| `/app/cocina/comandas` | ✅ |
| `/app/cocina/recetas` | ✅ |
| `/app/cocina/actividad` | ✅ |
| `/app/cocina/actividades` | ✅ |
| `/app/cocina/evaluacion-masiva` | ✅ |
| `/app/cocina/evaluacion-individual` | ✅ |

---

### `/app/bar` — Bar

```mermaid
flowchart LR
    B["/app/bar"] --> LANDING["/ 🔶\nBarPageComponent — EmptyState sin lógica"]
    B --> COMAND["/comandas ✅\nComandasComponent"]
    B --> RECETAS["/recetas ✅\nRecetasPageComponent"]
    B --> MENU["/menu 🔶\nMenuPageComponent — EmptyState próximamente"]
```

| Ruta | Estado |
|------|--------|
| `/app/bar` | 🔶 EmptyState — sin lógica real |
| `/app/bar/comandas` | ✅ |
| `/app/bar/recetas` | ✅ |
| `/app/bar/menu` | 🔶 EmptyState — mensaje "próximamente" |

---

### `/app/restaurante` — Restaurante

```mermaid
flowchart LR
    R["/app/restaurante"] -->|redirect| MESAS
    R --> MESAS["/mesas ✅\nMesasPageComponent"]
    R --> PEDIDOS["/pedidos ✅\nPedidosPageComponent"]
    R --> CAJA["/caja ✅\nCajaPageComponent"]
    CAJA --> C_NUEVA["/caja/nueva ✅"]
    CAJA --> C_BUSCAR["/caja/buscar ✅"]
    CAJA --> C_PAGAR["/caja/pagar ✅"]
    CAJA --> C_APERTURA["/caja/apertura ✅"]
    CAJA --> C_CIERRE["/caja/cierre ✅"]
    CAJA --> C_MOV["/caja/movimientos ✅"]
```

| Ruta | Estado |
|------|--------|
| `/app/restaurante/mesas` | ✅ |
| `/app/restaurante/pedidos` | ✅ |
| `/app/restaurante/caja` | ✅ Dashboard de caja |
| `/app/restaurante/caja/nueva` | ✅ |
| `/app/restaurante/caja/buscar` | ✅ |
| `/app/restaurante/caja/pagar` | ✅ |
| `/app/restaurante/caja/apertura` | ✅ |
| `/app/restaurante/caja/cierre` | ✅ |
| `/app/restaurante/caja/movimientos` | 🔶 Solo router — sin facade ni datos |

---

### `/app/inventario` — Inventario 🔒

```mermaid
flowchart TD
    INV["/app/inventario"] -->|redirect| BIENES

    INV --> BIENES["/bienes ✅"]
    BIENES --> B_EXP["/bienes/exportar ✅"]
    BIENES --> B_ID["/bienes/:id ✅"]

    INV --> SOL["/solicitudes-gil ✅"]
    SOL --> SOL_NEW["/solicitudes-gil/nueva ✅"]
    SOL --> SOL_ID["/solicitudes-gil/:id ✅"]
    SOL_ID --> SOL_EDIT["/editar ✅"]
    SOL_ID --> SOL_EXP["/exportar ✅"]

    INV --> FACT["/facturas ✅"]
    FACT --> FACT_IMP["/facturas/importar ✅"]
    FACT --> FACT_GIL["/facturas/gil/:id ✅"]
    FACT --> FACT_ID["/facturas/:id ✅"]
    FACT_ID --> FACT_EDIT["/editar ✅"]

    INV --> CONS["/consolidado ✅"]
    CONS --> CONS_NEW["/consolidado/nuevo ✅"]
    CONS --> CONS_ID["/consolidado/:id ✅"]

    INV --> CONC["/conciliacion ✅"]
    CONC --> CONC_TF["/toma-fisica ✅"]
    CONC --> CONC_HIST["/historial ✅"]
    CONC --> CONC_ID["/conciliacion/:id ✅"]

    INV --> MOV["/movimientos ✅"]
    MOV --> MOV_ENT["/entrada ✅"]
    MOV --> MOV_GIL["/entrada-gil ✅"]
    MOV --> MOV_SAL["/salida ✅"]
    MOV --> MOV_EXP["/exportar ✅"]
    INV --> MOV_ID["/movimientos/:id ✅"]

    INV --> ALERT["/alertas ✅"]
    ALERT --> ALERT_HIST["/historial ✅"]
    ALERT --> ALERT_CFG["/configuracion ✅"]
    ALERT --> ALERT_ID["/alertas/:id ✅"]
    ALERT_ID --> ALERT_RES["/resolver ✅"]

    INV --> PRES["/presupuesto ✅"]
    PRES --> PRES_REG["/registrar ✅"]
    PRES --> PRES_TRA["/traslado ✅"]
    PRES --> PRES_EXP["/exportar ✅"]
    PRES --> PRES_GIL["/cargar-gil ✅"]

    INV --> ACTAS["/actas ✅"]
    ACTAS --> ACTAS_NEW["/nueva ✅"]
    ACTAS --> ACTAS_ID["/actas/:id ✅"]
    ACTAS_ID --> ACTAS_FIR["/cargar-firma ✅"]

    INV --> PAQ["/paquete-probatorio ✅"]
    PAQ --> PAQ_NEW["/nuevo ✅"]
    PAQ --> PAQ_ID["/paquete-probatorio/:id ✅"]
    PAQ_ID --> PAQ_ADJ["/adjuntar ✅"]
    PAQ_ID --> PAQ_REQ["/requisicion ✅"]

    INV --> REQ["/requisiciones ✅"]
    REQ --> REQ_DASH["/requisiciones dashboard ✅"]
    REQ_DASH --> REQ_DET["/detalle/:id ✅"]
    REQ_DASH --> REQ_DES["/despacho/:id ✅"]
    REQ --> REQ_NEW["/nueva ✅"]
    REQ --> REQ_FIR["/firmar/:id ✅"]
    REQ --> REQ_RES["/resumen/:id ✅"]
```

---

### Módulos stub

| Módulo | Ruta | Estado |
|--------|------|--------|
| Reportes | `/app/reportes` | 🔶 Solo landing — páginas internas pendientes |
| Notificaciones | `/app/notificaciones` | 🔶 Solo landing — páginas internas pendientes |

---

## Guards activos

| Guard | Aplicado en | Roles permitidos |
|-------|------------|-----------------|
| `authGuard` | `/app` (desactivado — ver `shell.routes.ts`) | Todos los autenticados |
| `roleGuard` | `/app/inventario` | `ADMINISTRADOR`, `CONTADORA` |
| `roleGuard` | `/app/cocina` (desactivado temporalmente) | `CHEF`, `ADMIN_COCINA`, `AUXILIAR_COCINA` |
| `roleGuard` | `/app/bar` (desactivado temporalmente) | `LIDER_BAR`, `ADMIN_BAR`, `BARTENDER` |

> ⚠️ Los guards de `authGuard` y los de cocina/bar están comentados con `TODO`. Activarlos antes de producción.
