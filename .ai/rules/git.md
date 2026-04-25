# Reglas de Git y flujo de trabajo

## Ramas

### Rama base siempre es `develop`

```bash
git checkout develop && git pull
git checkout -b {tipo}/{scope}/{descripcion}[-{RF}]
```

### Convención de nombres

```
feat/cocina/recipe-card-RF-C4.2.1
fix/shared/ui/data-table-pagination
chore/inventario/add-stock-model
refactor/auth/simplify-login-flow
test/bar/bar-facade-coverage
```

- `tipo`: `feat` | `fix` | `chore` | `refactor` | `test`
- `scope`: el dominio exacto (`cocina`, `bar`, `inventario`, `shared`, etc.)
- Un solo scope por rama — si tocás dos dominios, son dos ramas y dos PRs

## Commits

### Formato Conventional Commits (obligatorio)

```
{tipo}({scope}): {descripción en minúsculas} [{RF opcional}]
```

Ejemplos válidos:
```
feat(cocina): add recipe card component [RF-C4.2.1]
fix(shared/ui): correct table pagination overflow
chore(models): promote RecetaItem to shared/models
test(inventario): add facade unit tests
refactor(auth): simplify token refresh logic
```

Ejemplos inválidos:
```
fix stuff                          ← sin tipo ni scope
feat(Cocina): Add Recipe Card      ← mayúsculas
updated login                      ← sin tipo ni scope
feat(cocina/bar): add component    ← dos scopes
```

## Pull Requests

### Checklist antes de abrir el PR

```bash
nx affected:lint --base=develop   # 0 errores
nx affected:test --base=develop   # 0 fallos
```

### Reglas del PR

| Regla | Valor |
|---|---|
| Líneas modificadas | máximo 400 |
| Scopes tocados | exactamente 1 |
| Aprobaciones requeridas en `develop` | 1 |
| Aprobaciones requeridas en `main` | 2 |
| Self-merge | prohibido |
| Stale reviews | se invalidan automáticamente |

### Target del PR

- Features/fixes del día a día → `develop`
- Release a producción → `main` (solo el tech lead)
