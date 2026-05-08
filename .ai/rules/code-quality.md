# Calidad de código — estándares obligatorios

## Resumen rápido

| Área | Regla clave |
|------|------------|
| TypeScript | Sin `any`, sin `!` innecesario |
| Angular | `OnPush` + `standalone: true` + `inject()` + Signals |
| Estilos | Solo tokens CSS de `_variables.scss` — cero hardcodes |
| Tests | `.spec.ts` obligatorio · ≥ 70% coverage · sin mocks de DB |
| Comentarios | Solo el PORQUÉ, nunca el QUÉ |

---

## TypeScript

- **Sin `any`** — usá genéricos o `unknown` con type guard
- **Sin `!` non-null assertion** innecesario — validá antes
- Preferí `interface` sobre `type` para contratos de objetos
- Usá `enum` para valores fijos de dominio

---

## Angular — componentes

```typescript
// ✅ correcto
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiComponent {
  private facade = inject(MiFacade);
  readonly items = this.facade.items;
  readonly count = computed(() => this.items().length);
}

// ❌ incorrecto
@Component({})
export class MiComponent {
  constructor(private facade: MiFacade) {}
  items: Item[] = [];
  ngOnInit() { this.items = this.facade.getItems(); }
}
```

**Siempre:**
- `standalone: true`
- `ChangeDetectionStrategy.OnPush`
- `inject()` en vez de constructor injection
- Signals para estado local (`signal()`, `computed()`)

**Nunca:**
- Lógica de negocio en componentes — va en el facade o service
- Estilos inline en templates — todo en el `.scss`

---

## Estilos — tokens siempre, hardcodes nunca

```scss
// ✅ correcto
.badge {
  background: var(--color-estado-listo);
  padding: var(--space-2);
  border-radius: var(--radius-md);
}

// ❌ incorrecto
.badge {
  background: #00B894;
  padding: 8px;
  border-radius: 6px;
}
```

Fuente de verdad: `libs/shared/ui/src/lib/tokens/_variables.scss`

**Prohibido además:**
- `transition: all` — siempre propiedades explícitas
- Duraciones o easing hardcodeados — usar `var(--duration-fast)`, `var(--ease-standard)`
- Breakpoints inventados — ver escala oficial en `shared-ui-governance.md`

---

## Tests

```typescript
// estructura mínima esperada
it('should render', () => { /* valida que el componente existe */ });
it('should emit on click', () => { /* valida comportamiento */ });
```

- Todo componente nuevo → su `.spec.ts`
- Todo service nuevo → su `.spec.ts`
- Coverage mínimo: **70% por librería**
- Sin mocks de base de datos — usá `of()` con datos de prueba tipados

---

## Comentarios

```typescript
// ✅ correcto — explica el PORQUÉ (restricción no obvia)
// Angular no permite host binding en componentes standalone con encapsulation None
@HostBinding('class') hostClass = 'dt-wrapper';

// ❌ incorrecto — explica el QUÉ (el nombre ya lo dice)
// Incrementa el contador
this.count++;
```

- Sin `TODO` sin ticket asociado — si hay deuda, se registra en Notion/Roadmap
