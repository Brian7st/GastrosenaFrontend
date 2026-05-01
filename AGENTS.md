# GastroSENA — Instrucciones para agentes de IA

## Protocolo obligatorio antes de cualquier cambio

**No escribas código hasta completar este protocolo.**

### Paso 1 — Identificar contexto

Preguntá al desarrollador:

```
Antes de empezar necesito saber:
1. ¿En qué dominio vas a trabajar?
   → shell | auth | cocina | bar | restaurante | inventario |
     abastecimiento | facturacion | presupuesto | requisiciones |
     reportes | notificaciones | shared

2. ¿Cuál es el RF o descripción del cambio?

3. ¿Tipo de cambio?
   → feat | fix | chore | refactor | test

4. ¿El cambio toca únicamente ese dominio?
```

### Paso 2 — Leer reglas del dominio

Leer `.ai/domains/{dominio}.md` para conocer:
- Qué archivos podés modificar
- Qué archivos son solo lectura
- Qué archivos nunca tocás

### Paso 3 — Confirmar antes de actuar

```
Voy a trabajar en libs/{dominio}/.
El commit será: {tipo}({dominio}): {descripción}
¿Correcto?
```

---

## Estructura del proyecto

```
libs/
├── shell/          → routing, layouts, landing
├── auth/           → login, usuarios
├── cocina/         → operaciones cocina
├── bar/            → operaciones bar
├── restaurante/    → salón y comandas
├── inventario/     → stock y bienes
├── abastecimiento/ → GIL y consolidados
├── facturacion/    → FEL y facturas
├── presupuesto/    → techos y ZESE
├── requisiciones/  → requisiciones y actas
├── reportes/       → exportables PDF/Excel
├── notificaciones/ → alertas en tiempo real
└── shared/         → SOLO equipo Arquitectura
```

## Reglas de dependencias

```
✅ feature → shared
❌ feature → feature
❌ shared  → feature
```

Importar siempre con alias:
```typescript
import { X } from '@restaurant/shared/ui';
import { Y } from '@restaurant/shared/models';
```

## Estándares de código Angular

```typescript
// Siempre así:
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiComponent {
  private facade = inject(MiFacade);
}
```

- Sin `any` en TypeScript
- Sin estilos inline en templates
- Sin colores hardcodeados — usar `var(--color-*)` de `_variables.scss`
- Signals para estado local
- Facade como único punto de acceso al store

## Formato de commit obligatorio

```
{tipo}({scope}): {descripción en minúsculas}

Ejemplos:
feat(cocina): add kitchen board component [RF-C4.0]
fix(inventario): correct stock alert calculation
chore(shared/models): promote Pedido interface
```

## Archivos bloqueados — nunca modificar sin aprobación

- `libs/shared/**`
- `tsconfig.base.json`
- `.eslintrc.json`
- `nx.json`
- `apps/**`
- `package.json`
- `libs/shell/shell/src/lib/shell.routes.ts`
