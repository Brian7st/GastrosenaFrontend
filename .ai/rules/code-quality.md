# Reglas de calidad de código

## TypeScript

- **Sin `any`** — usar tipos genéricos o `unknown` con type guard
- **Sin `!` non-null assertion** innecesario — validar antes
- Interfaces sobre `type` para contratos de objetos
- Enums para valores fijos de dominio

## Angular

- **Siempre `ChangeDetectionStrategy.OnPush`** en componentes nuevos
- **Siempre `standalone: true`** — no usar NgModules
- **`inject()`** en vez de constructor injection
- **Signals** para estado local del componente (`signal()`, `computed()`)
- Sin lógica de negocio en componentes — eso va en el facade o service
- Sin estilos inline en templates — todo en el `.scss` del componente

```typescript
// ✅ correcto
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiComponent {
  private facade = inject(MiFacade);
  readonly items = this.facade.items;
}

// ❌ incorrecto
@Component({})
export class MiComponent {
  constructor(private facade: MiFacade) {}
  items: Item[] = [];
  ngOnInit() { this.items = this.facade.getItems(); }
}
```

## Estilos

- **Sin colores, espaciados ni tipografía definidos fuera de** `libs/shared/ui/src/lib/tokens/_variables.scss`
- Usar siempre las variables CSS: `var(--color-success)`, `var(--space-4)`, etc.

```scss
// ✅ correcto
.badge { background: var(--color-estado-listo); padding: var(--space-2); }

// ❌ incorrecto
.badge { background: #00B894; padding: 8px; }
```

## Tests

- Todo componente nuevo lleva su `.spec.ts`
- Todo service nuevo lleva su `.spec.ts`
- Mínimo: 1 test de renderizado + 1 test de comportamiento por componente
- Coverage mínimo 70% por librería
- Sin mocks de base de datos — usar `of()` con datos de prueba reales

## Comentarios

- Sin comentarios que expliquen QUÉ hace el código — el nombre del símbolo ya lo dice
- Solo comentar el PORQUÉ cuando hay una restricción no obvia o un workaround
- Sin `TODO` sin ticket asociado
