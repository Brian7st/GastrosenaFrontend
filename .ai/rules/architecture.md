# Reglas de arquitectura — módulos y dependencias

## Regla de oro

```
feature-*   → puede importar de  shared/*
feature-*   → NUNCA importa de otro feature-*
shared/*    → NUNCA importa de feature-*
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
| `@restaurant/feature-shell` | `libs/shell/feature-shell` |
| `@restaurant/feature-home` | `libs/shell/feature-home` |
| `@restaurant/feature-auth` | `libs/auth/feature-auth` |
| `@restaurant/feature-usuarios` | `libs/auth/feature-usuarios` |
| `@restaurant/feature-cocina` | `libs/cocina/feature-cocina` |
| `@restaurant/feature-bar` | `libs/bar/feature-bar` |
| `@restaurant/feature-restaurante` | `libs/restaurante/feature-restaurante` |
| `@restaurant/feature-inventario` | `libs/inventario/feature-inventario` |
| `@restaurant/feature-abastecimiento` | `libs/abastecimiento/feature-abastecimiento` |
| `@restaurant/feature-facturacion` | `libs/facturacion/feature-facturacion` |
| `@restaurant/feature-presupuesto` | `libs/presupuesto/feature-presupuesto` |
| `@restaurant/feature-requisiciones` | `libs/requisiciones/feature-requisiciones` |
| `@restaurant/feature-reportes` | `libs/reportes/feature-reportes` |
| `@restaurant/feature-notificaciones` | `libs/notificaciones/feature-notificaciones` |
| `@restaurant/shared/auth` | `libs/shared/auth` |
| `@restaurant/shared/api` | `libs/shared/api` |
| `@restaurant/shared/state` | `libs/shared/state` |
| `@restaurant/shared/ui` | `libs/shared/ui` |
| `@restaurant/shared/models` | `libs/shared/models` |
| `@restaurant/shared/util` | `libs/shared/util` |

## Estructura interna de cada feature

```
libs/{dominio}/{feature-name}/
└── src/lib/
    ├── ui/           ← componentes visuales (solo presentación)
    ├── data-access/  ← facade, services, NgRx store
    ├── models/       ← interfaces propias del dominio
    └── util/         ← helpers específicos (no comparten con otros dominios)
```

## Promoción de modelos

Si una interfaz definida en `feature-*/models` es necesaria en más de un feature:
1. Abrir PR con scope `chore/shared`
2. Mover la interfaz a `libs/shared/models/`
3. Actualizar las importaciones
Nunca importar directamente entre features.
