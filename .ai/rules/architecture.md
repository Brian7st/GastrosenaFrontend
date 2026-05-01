# Reglas de arquitectura — módulos y dependencias

## Regla de oro

```
{dominio}   → puede importar de  shared/*
{dominio}   → NUNCA importa de otro {dominio}
shared/*    → NUNCA importa de {dominio}
```

## Aliases de importación válidos

Usá SIEMPRE el alias, nunca rutas relativas entre librerías:

```typescript
// ✅ correcto
import { AuthService } from '@restaurant/shared/auth';
import { DataTableComponent } from '@restaurant/shared/ui';

// ❌ incorrecto
import { AuthService } from '../../shared/auth/src/lib/auth.service';
```

## Aliases disponibles

| Alias | Ubicación real |
|---|---|
| `@restaurant/shell` | `libs/shell/shell` |
| `@restaurant/home` | `libs/shell/home` |
| `@restaurant/auth` | `libs/auth/auth` |
| `@restaurant/usuarios` | `libs/auth/usuarios` |
| `@restaurant/cocina` | `libs/cocina/cocina` |
| `@restaurant/bar` | `libs/bar/bar` |
| `@restaurant/restaurante` | `libs/restaurante/restaurante` |
| `@restaurant/inventario` | `libs/inventario/inventario` |
| `@restaurant/abastecimiento` | `libs/abastecimiento/abastecimiento` |
| `@restaurant/reportes` | `libs/reportes/reportes` |
| `@restaurant/notificaciones` | `libs/notificaciones/notificaciones` |
| `@restaurant/shared/auth` | `libs/shared/auth` |
| `@restaurant/shared/api` | `libs/shared/api` |
| `@restaurant/shared/state` | `libs/shared/state` |
| `@restaurant/shared/ui` | `libs/shared/ui` |
| `@restaurant/shared/models` | `libs/shared/models` |
| `@restaurant/shared/util` | `libs/shared/util` |

## Estructura interna de cada dominio

```
libs/{dominio}/{dominio}/
└── src/lib/
    ├── ui/           ← componentes visuales (solo presentación)
    ├── data-access/  ← facade, services, NgRx store
    ├── models/       ← interfaces propias del dominio
    └── util/         ← helpers específicos (no comparten con otros dominios)
```

## Promoción de modelos

Si una interfaz definida en `{dominio}/models` es necesaria en más de un dominio:
1. Abrir PR con scope `chore/shared`
2. Mover la interfaz a `libs/shared/models/`
3. Actualizar las importaciones
Nunca importar directamente entre dominios.
