# GastroSENA Frontend — Guía de Setup y Desarrollo

## Requisitos previos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 20.x LTS | `node -v` |
| npm | 10.x | `npm -v` |
| Angular CLI | 20.x | `ng version` |
| Nx CLI | 20.x | `nx --version` |
| Git | cualquiera | `git --version` |

Instalar Nx globalmente si no lo tenés:

```bash
npm install -g nx@latest
```

---

## 1. Instalación

```bash
git clone https://github.com/Brian7st/GastrosenaFrontend.git
cd GastrosenaFrontend
npm install
```

---

## 2. Correr el proyecto

```bash
# Servidor de desarrollo
npm start
# equivale a: nx serve restaurant-app

# Abrir en el navegador
# http://localhost:4200
```

---

## 3. Estructura del proyecto

```
libs/
├── shell/          → routing principal, layouts, guards, navegación
├── auth/           → login, usuarios y roles
├── cocina/         → operaciones de cocina
├── bar/            → operaciones de bar
├── restaurante/    → salón y servicio
├── inventario/     → gestión de bienes y stock
├── abastecimiento/ → GIL, consolidados, paquete probatorio
├── reportes/       → reportes exportables PDF/Excel
├── notificaciones/ → alertas de stock en tiempo real
└── shared/         → código compartido (NO modificar sin hablar con Arquitectura)
```

Cada dev trabaja únicamente dentro de su carpeta de dominio.
Ver [`docs/arquitectura.md`](arquitectura.md) para la descripción completa.

---

## 4. Comandos del día a día

```bash
# Servidor de desarrollo
npm start

# Tests afectados por mis cambios
npm test
# equivale a: nx affected:test --base=develop

# Lint afectado
npm run lint
# equivale a: nx affected:lint --base=develop

# Ver el grafo de dependencias
npm run graph

# Formatear todo el código
npm run format

# Tests de un dominio específico
nx test cocina

# Tests en modo watch durante desarrollo
nx test cocina --watch

# Tests con coverage
nx test cocina --coverage

# Correr un archivo de test específico
nx test cocina --testFile=libs/cocina/cocina/src/lib/ui/receta-card/receta-card.component.spec.ts

# Ver proyectos afectados por mis cambios (sin correrlos)
nx affected:graph --base=develop

# Build de producción
nx build restaurant-app --configuration=production

# Ver todos los proyectos del workspace
nx show projects
```

---

## 5. Generators de Nx — todos los comandos importantes

> Todos los comandos admiten `--dry-run` para previsualizar qué archivos se van a crear sin crear nada.
>
> ```bash
> nx g @nx/angular:component mi-componente --project=cocina --dry-run
> ```

### Componente

```bash
# Componente en la capa ui/ de un dominio
nx g @nx/angular:component nombre-componente \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/ui \
  --standalone \
  --change-detection=OnPush

# Ejemplo real
nx g @nx/angular:component receta-card \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/ui \
  --standalone \
  --change-detection=OnPush
```

### Page (componente con routing)

```bash
# Las pages van en su propia carpeta dentro de lib
nx g @nx/angular:component pages/nombre-page \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib \
  --standalone \
  --change-detection=OnPush

# Ejemplo real
nx g @nx/angular:component pages/recetas-page \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib \
  --standalone \
  --change-detection=OnPush
```

### Service

```bash
# Servicio HTTP en la capa data-access/
nx g @nx/angular:service nombre-servicio \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access

# Ejemplo real
nx g @nx/angular:service recetas \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access
```

### Facade

```bash
# La facade es un service especial que orquesta el store
nx g @nx/angular:service nombre-facade \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access

# Renombralo manualmente a nombre-facade.ts después de generarlo
# Ejemplo real
nx g @nx/angular:service cocina-facade \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access
```

### Guard

```bash
# Guards van en shell o en el dominio que los necesite
nx g @nx/angular:guard nombre-guard \
  --project=shell \
  --path=libs/shell/shell/src/lib/guards \
  --implements=CanActivate

# Ejemplo real
nx g @nx/angular:guard auth \
  --project=shell \
  --path=libs/shell/shell/src/lib/guards \
  --implements=CanActivate
```

### Interceptor

```bash
nx g @nx/angular:interceptor nombre-interceptor \
  --project=shared-api \
  --path=libs/shared/api/src/lib

# Ejemplo real
nx g @nx/angular:interceptor auth-token \
  --project=shared-api \
  --path=libs/shared/api/src/lib
```

### Pipe

```bash
nx g @nx/angular:pipe nombre-pipe \
  --project=shared-util \
  --path=libs/shared/util/src/lib \
  --standalone

# Ejemplo real
nx g @nx/angular:pipe currency-format \
  --project=shared-util \
  --path=libs/shared/util/src/lib \
  --standalone
```

### Directive

```bash
nx g @nx/angular:directive nombre-directive \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/ui \
  --standalone

# Ejemplo real
nx g @nx/angular:directive highlight-row \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/ui \
  --standalone
```

### Interface / Modelo

```bash
# Las interfaces van en models/ del dominio
nx g @nx/angular:interface nombre-interface \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/models

# Ejemplo real
nx g @nx/angular:interface receta \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/models
```

### Enum

```bash
nx g @nx/angular:enum nombre-enum \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/models

# Ejemplo real
nx g @nx/angular:enum estado-pedido \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/models
```

### NgRx — Feature Store completo

```bash
# Genera actions + reducer + effects + selectors en un solo comando
nx g @ngrx/schematics:feature nombre-feature \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access/store \
  --module=false

# Ejemplo real
nx g @ngrx/schematics:feature recetas \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access/store \
  --module=false
```

### NgRx — Piezas individuales

```bash
# Solo actions
nx g @ngrx/schematics:action recetas \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access/store

# Solo reducer
nx g @ngrx/schematics:reducer recetas \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access/store

# Solo effects
nx g @ngrx/schematics:effect recetas \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access/store

# Solo selectors
nx g @ngrx/schematics:selector recetas \
  --project=cocina \
  --path=libs/cocina/cocina/src/lib/data-access/store
```

### Nueva librería dentro de un dominio

```bash
# Estructura: libs/{dominio}/{nombre-lib}/
nx g @nx/angular:library nombre-lib \
  --directory=libs/cocina/nombre-lib \
  --tags="scope:cocina,type:feature" \
  --standalone \
  --importPath="@restaurant/nombre-lib"

# Ejemplo real
nx g @nx/angular:library cocina-recetas \
  --directory=libs/cocina/cocina-recetas \
  --tags="scope:cocina,type:feature" \
  --standalone \
  --importPath="@restaurant/cocina-recetas"
```

Después de crear una librería, hacer DOS cosas más:

1. Agregar el alias en `tsconfig.base.json`:
```json
"@restaurant/cocina-recetas": ["libs/cocina/cocina-recetas/src/index.ts"]
```

2. Agregar la ruta en `libs/shell/shell/src/lib/shell.routes.ts`

---

## 6. Estructura interna de una feature

```
libs/cocina/cocina/src/lib/
├── ui/               ← componentes presentacionales del dominio
│   ├── receta-card/
│   └── pedido-list/
├── pages/            ← componentes con routing (una page por ruta)
│   ├── recetas-page/
│   └── pedido-detalle-page/
├── data-access/      ← facade, services, store NgRx
│   ├── store/        ← actions, reducer, effects, selectors
│   ├── cocina.facade.ts
│   └── recetas.service.ts
├── models/           ← interfaces y enums propios del dominio
│   ├── receta.interface.ts
│   └── estado-pedido.enum.ts
└── util/             ← helpers específicos (no van a shared)
```

---

## 7. Flujo de trabajo Git

```bash
# 1. Partir siempre desde develop actualizado
git checkout develop
git pull

# 2. Crear la rama con la convención correcta
git checkout -b feat/cocina/nombre-descripcion-RF-C4.1

# 3. Desarrollar...

# 4. Verificar antes de abrir el PR (OBLIGATORIO)
nx affected:lint --base=develop   # debe dar 0 errores
nx affected:test --base=develop   # debe dar 0 fallos

# 5. Push y abrir PR hacia develop
git push origin feat/cocina/nombre-descripcion-RF-C4.1
```

### Convención de nombres de rama

```
{tipo}/{scope}/{descripcion}[-{RF_opcional}]

tipo:  feat | fix | chore | refactor | test
scope: shell | auth | cocina | bar | restaurante |
       inventario | abastecimiento | reportes | shared
```

### Formato de commit

```
feat(cocina): add recipe card component [RF-C4.2.1]
fix(shared/ui): correct table pagination on mobile
chore(models): promote RecetaItem to shared/models
```

---

## 8. Reglas que no se negocian

- **Un scope por PR** — si tocás dos dominios, son dos PRs
- **Máximo 400 líneas por PR** — sin excepciones
- **No importar de otro dominio** — solo podés importar de `@restaurant/shared/*`
- **No self-merge** — quien abre el PR no puede aprobarlo
- **Sin `any` en TypeScript** — usar tipos genéricos o `unknown`
- **Sin estilos inline** — todo en el `.scss` del componente o en `_variables.scss`

Ver [`docs/contributing.md`](contributing.md) para la lista completa.

---

## 9. Variables de entorno

El proyecto no requiere variables de entorno para correr en local.
Cuando se conecte el backend, se usarán los archivos de environment de Angular:

```
apps/restaurant-app/src/environments/
├── environment.ts        ← desarrollo local
└── environment.prod.ts   ← producción
```

---

## 10. Problemas frecuentes

**El servidor no levanta / error de compilación**
```bash
nx reset
rm -rf .angular/cache
npm start
```

**El lint falla con "module boundary" error**
Estás importando desde un dominio que no te corresponde.
Revisá [`docs/arquitectura.md`](arquitectura.md) sección Regla de Oro de Dependencias.

**Error de TypeScript con un path alias**
Verificá que el alias esté declarado en `tsconfig.base.json` apuntando a la ubicación correcta.

**No encuentro el proyecto correcto para `--project=`**
```bash
# Listar todos los proyectos disponibles
nx show projects
```

---

## 11. Showcase interno de shared/ui

```bash
npx nx serve shared-ui-showcase
```

Usalo para:

- revisar visualmente los componentes compartidos
- sacar screenshots limpios
- alimentar la documentación del sistema de diseño en Notion

El showcase nuevo está organizado por secciones de documentación:

- Button
- Feedback
- Filtros
- Headers y títulos
- Data display
- Confirmaciones

Además, la shell expone una ruta pública `/showcase` para revisión rápida sin auth.

Ver también: [`docs/shared-ui-showcase.md`](shared-ui-showcase.md)
