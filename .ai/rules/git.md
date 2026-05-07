# Git — ramas, commits y PRs

## Flujo estándar

```
develop (base)
   └── feat/cocina/recipe-card        ← tu rama
         └── commit, commit, commit
               └── PR → develop       ← revisión + merge
```

**La rama base es siempre `develop`.** Nunca trabajar directamente en `develop` ni en `main`.

---

## Crear una rama

```bash
git checkout develop && git pull
git checkout -b {tipo}/{scope}/{descripcion}[-{RF}]
```

**Ejemplos válidos:**
```
feat/cocina/recipe-card-RF-C4.2.1
fix/shared/ui/data-table-pagination
chore/inventario/add-stock-model
refactor/auth/simplify-login-flow
test/bar/bar-facade-coverage
```

| Parte | Valores válidos |
|-------|----------------|
| `tipo` | `feat` · `fix` · `chore` · `refactor` · `test` |
| `scope` | el dominio exacto: `cocina`, `bar`, `inventario`, `shared`, etc. |

> Un solo scope por rama. Si tocás dos dominios → dos ramas, dos PRs.

---

## Commits — Conventional Commits obligatorio

```
{tipo}({scope}): {descripción en minúsculas} [RF opcional]
```

**Válidos:**
```
feat(cocina): add recipe card component [RF-C4.2.1]
fix(shared/ui): correct table pagination overflow
chore(models): promote RecetaItem to shared/models
test(inventario): add facade unit tests
refactor(auth): simplify token refresh logic
```

**Inválidos:**
```
fix stuff                          ← sin tipo ni scope
feat(Cocina): Add Recipe Card      ← mayúsculas
updated login                      ← sin tipo ni scope
feat(cocina/bar): add component    ← dos scopes en un commit
```

---

## Pull Requests

### Antes de abrir el PR

```bash
nx affected:lint --base=develop   # debe dar 0 errores
nx affected:test --base=develop   # debe dar 0 fallos
```

### Reglas del PR

| Regla | Límite |
|-------|--------|
| Líneas modificadas | máximo 400 |
| Scopes tocados | exactamente 1 |
| Aprobaciones en `develop` | mínimo 1 |
| Aprobaciones en `main` | mínimo 2 |
| Self-merge | prohibido |
| Stale reviews | se invalidan automáticamente con nuevos commits |

### Target

| Cambio | Target |
|--------|--------|
| Features y fixes del día a día | `develop` |
| Release a producción | `main` — solo el tech lead |
