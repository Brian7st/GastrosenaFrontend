# Gobierno de shared/ui

> Documento vinculante. Última actualización: 2026-05-07.
> Todo lo que no esté explícitamente permitido aquí está prohibido.

---

## TL;DR — las 4 reglas que más se rompen

1. **¿Querés crear un componente en shared?** → Primero el proceso de promoción. No al revés.
2. **¿Vas a poner un color o tamaño?** → Solo con `var(--token)`. Nunca un valor hardcodeado.
3. **¿Vas a usar un ícono?** → Solo Lucide. Registralo en `RESTAURANT_UI_BASE_ICONS`.
4. **¿Cómo sabés si un componente está listo?** → Cumple el checklist del final de este doc.

---

## 1. Qué entra a `shared/ui`

Un componente puede vivir en `shared/ui` **solo si cumple todo esto**:

| Criterio | Descripción |
|----------|-------------|
| Reutilización | Lo usan **2 o más dominios distintos** |
| Aislamiento | Sin lógica de negocio ni referencias a un dominio específico |
| Tokens | Usa **exclusivamente** `var(--token)` de `_variables.scss` |
| Estados | Cubre los estados mínimos (ver sección 4) |
| Showcase | Tiene entrada en `/showcase` |
| Documentación | Tiene ficha en Notion/Componentes |

---

## 2. Qué NO va a `shared/ui`

Si el componente cumple alguna de estas condiciones, **se queda en `{dominio}/ui/`**:

- Solo lo usa un dominio
- Tiene lógica de negocio o referencia datos de un dominio
- Es un wrapper muy fino sin reutilización real
- Es una vista o página completa, no un bloque UI

---

## 3. Proceso de promoción a shared

```
1. Dev abre issue con etiqueta "promotion/shared-ui"
   └── incluye: API propuesta, 2+ dominios que lo necesitan, tokens que usa

2. Equipo de Arquitectura evalúa en ≤ 2 días hábiles

3. Se crea rama feat/shared/nombre-componente

4. PR con 2 aprobaciones del equipo de Arquitectura

5. Merge solo por el tech lead
```

> Si es urgente: hablar directamente con el tech lead. **Nunca saltear el proceso.**

---

## 4. Criterios mínimos de un componente

### Estados obligatorios

| Estado | Cuándo |
|--------|--------|
| `default` | Siempre |
| `hover` | Siempre |
| `focus` con `var(--focus-ring)` | Siempre |
| `disabled` — `opacity: 0.5` + `pointer-events: none` | Siempre |
| `error` | En inputs y formularios |
| `readonly` | Solo si aplica |
| `loading` | Solo si aplica |

### Accesibilidad mínima

- `role` semántico cuando el HTML nativo no alcanza
- `aria-label` o `aria-labelledby` en controles sin texto visible
- `aria-invalid` + `aria-describedby` en estados de error
- IDs únicos por instancia — nunca IDs estáticos en componentes reutilizables
- Contraste mínimo WCAG AA

### Código Angular

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // sin any, sin !, sin constructor injection
})
```

- `standalone: true` + `ChangeDetectionStrategy.OnPush`
- `inject()` en vez de constructor injection
- Sin `any`, sin `!` non-null assertion innecesario
- Spec con ≥ 1 test de render + ≥ 1 test de comportamiento

---

## 5. Iconografía — política cerrada

| | |
|--|--|
| **Librería oficial** | `@lucide/angular` via `LucideIconComponent` |
| **Registro** | `RESTAURANT_UI_BASE_ICONS` en `restaurant-ui.providers.ts` |
| **Prohibido** | `material-symbols-outlined`, Font Awesome, SVG inline no catalogado |
| **Para agregar un ícono** | Agregarlo al array `RESTAURANT_UI_BASE_ICONS` en la misma PR |

---

## 6. Motion — tokens siempre, valores hardcodeados nunca

```scss
// ✅ correcto
transition: color       var(--duration-fast) var(--ease-standard);
transition: box-shadow  var(--duration-base) var(--ease-standard);

// ❌ incorrecto
transition: all 0.2s ease;
```

| Token | Valor | Cuándo usarlo |
|-------|-------|--------------|
| `--duration-fast` | 150ms | Micro-interacciones: hover, focus |
| `--duration-base` | 250ms | Transiciones de estado |
| `--duration-slow` | 400ms | Animaciones de entrada/salida |

---

## 7. Breakpoints — escala oficial

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `--breakpoint-sm` | 576px | Mobile landscape |
| `--breakpoint-md` | 768px | Tablet |
| `--breakpoint-lg` | 1024px | Desktop |
| `--breakpoint-xl` | 1280px | Desktop wide |
| `--breakpoint-2xl` | 1440px | Ultrawide |

```scss
// ✅ correcto — los tokens no funcionan en media queries, usar el valor directamente
@media (max-width: 768px) { ... }

// ❌ prohibido — valores que no están en la escala oficial
@media (max-width: 800px) { ... }
@media (max-width: 480px) { ... }
```

---

## 8. Gradientes

- Permitidos **solo como tokens**
- Actualmente: `var(--color-primario)` → `var(--color-primario-gradient-end)`
- No se permiten gradientes decorativos sin token asociado
- No se permiten gradientes de librerías externas (Tailwind, Bootstrap, etc.)

---

## 9. ¿Componente, patrón o solución local?

| Caso | Dónde va |
|------|----------|
| Bloque UI genérico, 2+ dominios | `shared/ui` |
| Composición de componentes shared (ej: form con varios inputs) | Patrón documentado en Notion/Patrones |
| Bloque UI específico de un dominio | `{dominio}/ui/` |
| Un wrapper de 3 líneas o un one-liner | Inline — no componentizar |

---

## 10. Checklist de componente cerrado al 100%

Un componente está **cerrado** cuando cumple **todo** sin excepción:

- [ ] Vive en `shared/ui/src/lib/components/`
- [ ] Exportado en `libs/shared/ui/src/index.ts`
- [ ] Usa solo tokens CSS (`_variables.scss`) — cero hardcodes
- [ ] Tiene todos los estados mínimos (sección 4)
- [ ] Usa Lucide — sin Material Symbols
- [ ] Tiene `*.spec.ts` con ≥ 70% coverage
- [ ] Tiene entrada en el showcase (`/showcase`)
- [ ] Tiene ficha en Notion con: propósito, cuándo usarlo, cuándo no, variantes, accesibilidad y deuda
