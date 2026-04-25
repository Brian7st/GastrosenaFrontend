# BASES_GLOBALES_MONOREPO

> Documento base para extraer primero la infraestructura compartida antes de migrar features de negocio.
> Verificado sobre el código real en `C:\Users\MI PC\OneDrive\Desktop\microFrontends`.

---

## 1. Objetivo

Antes de migrar `inventario`, `restaurante`, `cocina`, `facturación` o cualquier dominio, hay que consolidar primero las **bases globales del sistema**.

La regla es simple:

> **Primero base compartida. Después features. Nunca al revés.**

Si no hacemos esto, el monorepo nace con:
- layouts duplicados
- tokens inconsistentes
- componentes repetidos
- modelos incompatibles
- navegación acoplada

---

## 2. Qué se considera “base global”

Estas son las piezas que deben existir primero en el monorepo:

1. **Shell/layout global**
2. **Design tokens**
3. **Estilos globales**
4. **Contratos de navegación**
5. **Sistema de iconos**
6. **Modelos compartidos base**
7. **Convenciones de estructura**
8. **Reglas de promoción a shared**

---

## 3. Base global #1 — Shell/Layout

## Fuente principal verificada
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\lib\main-layout\main-layout.component.ts`
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\lib\barra-lateral\barra-lateral.component.ts`
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\lib\barra-superior\barra-superior.component.ts`

## Componentes globales a extraer
- `MainLayoutComponent`
- `BarraLateralComponent`
- `BarraSuperiorComponent`

## Responsabilidad
- estructura principal de la aplicación
- sidebar global
- topbar global
- área de contenido con `router-outlet`
- navegación configurable por datos

## Decisión
Estos componentes deben convertirse en la base de:
- `libs/feature-shell`

## No mezclar con
- lógica de negocio
- menús específicos de un módulo
- rutas hardcodeadas por dominio

---

## 4. Base global #2 — Design Tokens

## Fuente principal verificada
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\styles\_variables.scss`
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\Frontend-inventario-actualizado\src\styles\variables.scss`

## Tokens globales a definir

### Colores
- primario SENA: `#39A900`
- primario hover: `#38A800`
- escalas esmeralda
- escalas pizarra
- color terciario/error
- superficie
- contorno
- texto primario/secundario

### Tipografía
- titulares: `Manrope`
- cuerpo: `Inter`
- etiqueta: `Inter`

### Bordes/radios
- `0.125rem`
- `0.25rem`
- `0.5rem`
- `0.75rem`
- `1rem`
- `9999px`

### Sombras
- baja
- media

### Layout sizes
- sidebar: `16rem`
- topbar: `4rem`
- padding horizontal base: `2rem`
- padding top de contenido: `6rem`

## Decisión
Esto debe vivir en:
- `libs/shared/ui/tokens`

## Regla
**Nadie define colores, spacing, sombras o tamaños por fuera de los tokens.**

---

## 5. Base global #3 — Estilos globales

## Fuente principal verificada
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\styles\styles.scss`

## Qué aporta
- reset base
- fuentes globales
- clases utilitarias mínimas
- convenciones del layout principal
- configuración visual general del shell

## Qué debe salir de acá
- reset global
- tipografía base
- utilidades mínimas reutilizables
- clases estructurales del layout

## Qué NO debe ir acá
- estilos específicos de una feature
- hacks de una sola pantalla
- overrides de un módulo puntual

## Destino
- `libs/shared/ui/styles`

---

## 6. Base global #4 — Contratos de navegación

## Fuente principal verificada
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\lib\models\nav.models.ts`

## Contratos detectados
- `NavItem`
- `NavGrupo`
- `PerfilConfig`
- `BarraLateralConfig`
- `TopNavLink`

## Responsabilidad
- definir la navegación por configuración
- evitar sidebars hardcodeados por cada app
- desacoplar layout de rutas concretas

## Decisión
Mover a:
- `libs/feature-shell/models`

## Regla
Los componentes de layout reciben configuración; **no conocen dominios concretos**.

---

## 7. Base global #5 — Sistema de iconos

## Fuente principal verificada
- `C:\Users\MI PC\OneDrive\Desktop\microFrontends\lib-gas-layout-frontend\projects\inventario-ui\src\lib\providers\inventario-ui.providers.ts`

## Qué define realmente
- `provideInventarioUi(...)`
- `INVENTARIO_UI_BASE_ICONS`
- integración con `provideLucideIcons(...)`

## Decisión
Esto debe convertirse en:
- `libs/shared/ui/icons`
  o
- `libs/shared/ui/providers`

## Regla
Providers de iconos NO son layout.
Son infraestructura de integración.

---

## 8. Base global #6 — Modelos compartidos mínimos

## Fuente real a consolidar
### Restaurante
- `mesa.model.ts`
- `orden.model.ts`
- `comanda.model.ts`
- `user.model.ts`

### Cocina
- `ingrediente.model.ts`
- `receta.model.ts`

### Inventario
- `bien.model.ts`
- modelos de facturas, solicitudes GIL, conciliación, presupuesto

## Qué debe existir primero como shared mínimo
- `Usuario`
- `Rol`
- `Mesa`
- `Pedido` / `Orden`
- `Comanda` (si cruza features)
- `Factura`
- `Bien`
- `ApiResponse`
- `PaginatedResponse`

## Destino
- `libs/shared/models`

## Regla
Solo sube a `shared/models` lo que realmente cruza dominios.
Lo específico se queda dentro de su feature.

---

## 9. Base global #7 — Convención estructural por librería

Cada feature migrada al monorepo debe respetar esta estructura:

```text
libs/feature-xxx/
  ui/
  data-access/
  models/
  util/
```

## Significado
- `ui/`: componentes visuales del dominio
- `data-access/`: services, adapters, store, facades
- `models/`: contratos propios del dominio
- `util/`: helpers puros del dominio

## Shared debe quedar así

```text
libs/shared/
  ui/
  models/
  util/
  api/
  auth/
  state/
```

---

## 10. Base global #8 — Reglas de promoción

## Un componente sube a shared/ui cuando:
- lo usan 3 o más features
- no tiene acoplamiento con dominio puntual
- su API se puede parametrizar

## Un modelo sube a shared/models cuando:
- lo usan 2 o más features
- representa un contrato transversal
- duplicarlo generaría divergencia

## Un util sube a shared/util cuando:
- es puro
- no depende de UI
- no depende de un dominio específico

---

## 11. Componentes globales iniciales candidatos

## Layout
- `MainLayoutComponent`
- `BarraLateralComponent`
- `BarraSuperiorComponent`

## Más adelante, cuando se verifique reuso real
- botón exportar
- modal confirmación
- badge de estado
- page header
- loading skeleton
- empty state
- buscador/filtro reutilizable

## IMPORTANTE
Estos últimos todavía necesitan validación cruzada entre módulos.
El shell y los tokens NO.
Esos sí son globales desde el arranque.

---

## 12. Orden correcto para construir las bases

### Etapa 1 — Shell y tokens
1. extraer `MainLayoutComponent`
2. extraer `BarraLateralComponent`
3. extraer `BarraSuperiorComponent`
4. extraer `nav.models.ts`
5. extraer `inventario-ui.providers.ts`
6. extraer `_variables.scss`
7. extraer `styles.scss`

### Etapa 2 — Shared contracts
8. definir `shared/models` mínimos
9. definir `shared/util` mínimos
10. definir `shared/api` base

### Etapa 3 — Recién ahí migrar features
11. inventario
12. facturación
13. abastecimiento
14. restaurante
15. cocina

---

## 13. Qué NO hacer

- no empezar copiando features completas
- no copiar sidebars distintas por módulo
- no mantener dos sistemas de colores
- no mezclar providers con layout
- no meter modelos de negocio concretos dentro de shared sin validar transversalidad
- no promover componentes a shared por intuición

---

## 14. Decisión arquitectónica propuesta

### Base oficial del sistema
Tomar como base oficial del monorepo:
- shell/layout de `inventario-ui`
- tokens de `inventario-ui`
- estilos globales de `inventario-ui`
- contratos de navegación de `inventario-ui`

### Ajuste necesario
`ga-web-restaurante` debe adaptarse a esta base y NO al revés.

¿Por qué?
Porque `inventario-ui` ya está diseñado como librería reusable.
Restaurante hoy tiene un layout más acoplado y menos parametrizable.

---

## 15. Resultado esperado después de consolidar las bases

Cuando esta etapa termine, el monorepo debería tener al menos:

```text
apps/
  restaurant-app/

libs/
  feature-shell/
  shared/
    ui/
      tokens/
      styles/
      icons/
    models/
    util/
    api/
    auth/
    state/
```

Y recién después empezar:

```text
libs/
  feature-inventario/
  feature-facturacion/
  feature-abastecimiento/
  feature-restaurante/
  feature-cocina/
```

---

## 16. Resumen ejecutivo

Si querés sacar “todo lo principal”, entonces lo principal NO son las features.
Lo principal es esto:

1. shell global
2. design tokens
3. estilos globales
4. contratos de navegación
5. providers de iconos
6. modelos compartidos mínimos
7. reglas estructurales
8. reglas de promoción a shared

Eso es la fundación.
Sin eso, migrar features es decorar una obra sin columnas.
