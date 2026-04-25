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
# Clonar el repositorio
git clone https://github.com/Brian7st/GastrosenaFrontend.git
cd GastrosenaFrontend

# Instalar dependencias
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
├── shell/          → routing, layouts, landing pública
├── auth/           → login, usuarios y roles
├── cocina/         → operaciones de cocina
├── bar/            → operaciones de bar
├── restaurante/    → salón y servicio
├── inventario/     → gestión de bienes y stock
├── abastecimiento/ → GIL, consolidados, paquete probatorio
├── facturacion/    → FEL, CUFE, facturas electrónicas
├── presupuesto/    → techos presupuestales, ZESE
├── requisiciones/  → requisiciones diarias, actas
├── reportes/       → reportes exportables PDF/Excel
├── notificaciones/ → alertas de stock en tiempo real
└── shared/         → código compartido (NO modificar sin hablar con Arquitectura)
```

Cada dev trabaja únicamente dentro de su carpeta de dominio.
Ver [`docs/arquitectura.md`](arquitectura.md) para la descripción completa.

---

## 4. Comandos del día a día

```bash
# Correr solo los tests afectados por mis cambios
npm test
# equivale a: nx affected:test --base=develop

# Lint solo de lo afectado
npm run lint
# equivale a: nx affected:lint --base=develop

# Ver el grafo de dependencias
npm run graph

# Formatear todo el código
npm run format

# Tests de un dominio específico
nx test feature-cocina

# Tests en modo watch durante desarrollo
nx test feature-cocina --watch
```

---

## 5. Crear una nueva feature

### Dentro de un dominio existente

```bash
# Ejemplo: nueva feature dentro del dominio cocina
nx g @nx/angular:library feature-cocina-recetas \
  --directory=libs/cocina/feature-cocina-recetas \
  --tags="scope:cocina,type:feature" \
  --standalone \
  --importPath="@restaurant/feature-cocina-recetas"
```

Luego agregar el alias en `tsconfig.base.json`:

```json
"@restaurant/feature-cocina-recetas": ["libs/cocina/feature-cocina-recetas/src/index.ts"]
```

Y agregar la ruta en `libs/shell/feature-shell/src/lib/shell.routes.ts`.

### Estructura interna de una feature

```
libs/cocina/feature-cocina-recetas/
└── src/
    └── lib/
        ├── ui/           ← componentes visuales del dominio
        ├── data-access/  ← facade, services, NgRx store
        ├── models/       ← interfaces propias del dominio
        └── util/         ← helpers específicos (no van a shared)
```

---

## 6. Flujo de trabajo Git

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
       inventario | abastecimiento | facturacion |
       presupuesto | requisiciones | reportes | shared
```

### Formato de commit

```
feat(cocina): add recipe card component [RF-C4.2.1]
fix(shared/ui): correct table pagination on mobile
chore(models): promote RecetaItem to shared/models
```

---

## 7. Reglas que no se negocian

- **Un scope por PR** — si tocás dos dominios, son dos PRs
- **Máximo 400 líneas por PR** — sin excepciones
- **No importar de otro dominio** — solo podés importar de `@restaurant/shared/*`
- **No self-merge** — quien abre el PR no puede aprobarlo
- **Sin `any` en TypeScript** — usar tipos genéricos o `unknown`
- **Sin estilos inline** — todo en el `.scss` del componente o en `_variables.scss`

Ver `CONTRIBUTING.md` para la lista completa.

---

## 8. Variables de entorno

El proyecto no requiere variables de entorno para correr en local.
Cuando se conecte el backend, se usarán los archivos de environment de Angular:

```
apps/restaurant-app/src/environments/
├── environment.ts        ← desarrollo local
└── environment.prod.ts   ← producción
```

---

## 9. Problemas frecuentes

**El servidor no levanta / error de compilación**
```bash
# Limpiar caché de Nx y Angular
nx reset
rm -rf .angular/cache
npm start
```

**El lint falla con "module boundary" error**
Estás importando desde un dominio que no te corresponde.
Revisá [`docs/arquitectura.md`](arquitectura.md) sección 4 — Regla de Oro de Dependencias.

**Error de TypeScript con un path alias**
Verificá que el alias esté declarado en `tsconfig.base.json` apuntando a la nueva ubicación.
