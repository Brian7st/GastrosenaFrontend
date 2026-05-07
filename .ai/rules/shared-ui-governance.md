# Gobierno de shared/ui — reglas cerradas

> Documento vinculante. Todo lo que no esté explícitamente permitido aquí está prohibido.
> Última actualización: 2026-05-07

---

## 1. Qué entra a `shared/ui`

Un componente puede vivir en `shared/ui` solo si cumple **todas** estas condiciones:

- Es consumido por **2 o más dominios distintos**
- No contiene lógica de negocio ni referencias a un dominio específico
- Usa **exclusivamente** tokens CSS de `_variables.scss` (sin hardcodes)
- Soporta tema (claro/oscuro)
- Tiene los **estados mínimos** cubiertos (ver sección 4)
- Tiene entrada en el **showcase** (ver sección 5)
- Tiene **documentación operativa** en Notion

## 2. Qué se queda en `{dominio}/ui/`

Si el componente cumple alguna de estas condiciones, NO va a shared:

- Solo lo usa un dominio
- Contiene lógica de negocio o referencias a un dominio
- Es un wrapper muy fino de otro componente sin reutilización real
- Es una vista o página, no un bloque UI

## 3. Quién aprueba promociones a shared

El proceso es:

1. **El dev** abre un issue con etiqueta `promotion/shared-ui` describiendo:
   - El componente y su API propuesta
   - Los 2+ dominios que lo necesitan
   - Los tokens que usa
2. **El equipo de Arquitectura** (3 personas) evalúa en ≤ 2 días hábiles
3. Se crea la rama `feat/shared/nombre-componente`
4. El PR requiere **2 aprobaciones** del equipo de Arquitectura
5. Merge solo por el tech lead

> Si urgente: hablar directamente con el tech lead. No saltear el proceso.

## 4. Criterios mínimos que debe cumplir un componente

### Tokens
- Todo color, espacio, tipografía y sombra debe usar `var(--token)` de `_variables.scss`
- Cero hardcodes de hex, rgb, px para colores, cero box-shadow inline

### Estados mínimos (controles interactivos)
| Estado    | Obligatorio |
|-----------|-------------|
| default   | ✅ |
| hover     | ✅ |
| focus     | ✅ (con `var(--focus-ring)`) |
| disabled  | ✅ (opacity 0.5 + pointer-events none) |
| error     | ✅ (para inputs y formularios) |
| readonly  | Solo si aplica |
| loading   | Solo si aplica |

### Accesibilidad mínima
- `role` semántico cuando el HTML nativo no alcanza
- `aria-label` o `aria-labelledby` en controles sin texto visible
- `aria-invalid` + `aria-describedby` para estados de error
- Contraste mínimo WCAG AA

### Código
- `standalone: true`
- `ChangeDetectionStrategy.OnPush`
- `inject()` en vez de constructor injection
- Sin `any`, sin `!` non-null assertion innecesario
- Spec con ≥ 1 test de render + ≥ 1 test de comportamiento

## 5. Iconografía — política cerrada

- **Librería oficial y única**: `@lucide/angular` via `LucideIconComponent`
- Los íconos se registran en `restaurant-ui.providers.ts` (`RESTAURANT_UI_BASE_ICONS`)
- **Prohibido**: `material-symbols-outlined`, Font Awesome, SVG inline no catalogado
- Para agregar un ícono nuevo: agregarlo al array `RESTAURANT_UI_BASE_ICONS` en la misma PR

## 6. Motion — reglas cerradas

Usar siempre los tokens de movimiento definidos en `_variables.scss`:

```scss
transition: color var(--duration-fast) var(--ease-standard);
transition: box-shadow var(--duration-base) var(--ease-standard);
```

- `--duration-fast` (150ms): micro-interacciones (hover, focus)
- `--duration-base` (250ms): transiciones de estado
- `--duration-slow` (400ms): animaciones de entrada/salida
- **Prohibido**: valores de duración o easing hardcodeados

## 7. Breakpoints — lista oficial

| Token              | Valor  | Uso |
|--------------------|--------|-----|
| `--breakpoint-sm`  | 576px  | Mobile landscape |
| `--breakpoint-md`  | 768px  | Tablet |
| `--breakpoint-lg`  | 1024px | Desktop |
| `--breakpoint-xl`  | 1280px | Desktop wide |
| `--breakpoint-2xl` | 1440px | Ultrawide |

```scss
// ✅ correcto — los CSS custom properties no funcionan en media queries, usar el valor
@media (max-width: 768px) { ... }

// ❌ prohibido — breakpoints inventados o valores distintos a los oficiales
@media (max-width: 800px) { ... }
```

## 8. Definición de "componente cerrado al 100%"

Un componente queda **cerrado** cuando cumple TODO esto:

- [ ] Vive en `shared/ui/src/lib/components/`
- [ ] Exportado en `libs/shared/ui/src/index.ts`
- [ ] Usa solo tokens CSS (`_variables.scss`)
- [ ] Soporta tema claro/oscuro
- [ ] Tiene estados mínimos según sección 4
- [ ] Usa Lucide (no Material Symbols)
- [ ] Tiene `*.spec.ts` con ≥ 70% coverage
- [ ] Tiene entrada en el showcase
- [ ] Documentado en Notion con: problema, cuándo usarlo, cuándo no, variantes, accesibilidad, deuda, comando showcase

## 9. Gradientes

- Permitidos **solo como tokens**. Actualmente: `var(--color-primario)` → `var(--color-primario-gradient-end)`
- No se permiten gradientes decorativos sin token asociado
- No se permiten gradientes de paleta externa (Tailwind, Bootstrap)

## 10. Qué es componente, patrón o solución local

| Caso | Dónde va |
|------|----------|
| Bloque UI genérico, 2+ dominios | `shared/ui` |
| Composición de componentes shared (ej: form con InputComponent) | Patrón documentado en Notion/Patrones |
| Bloque UI específico de un dominio | `{dominio}/ui/` |
| Un-liner o wrapper de 3 líneas | Inline, no componentizar |
