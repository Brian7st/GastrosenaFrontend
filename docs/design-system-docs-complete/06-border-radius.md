# 🔵 Sistema de Border Radius

> El radio define el lenguaje de forma del sistema.
> La consistencia visual hace que todos los componentes parezcan parte del mismo producto.

---

# 📏 Escala completa

| Token | Valor | Forma visual | Cuándo usar |
|---|---|---|---|
| `--radius-sm` | `4px` | `▢` casi cuadrado | Tags inline, tooltips, código |
| `--radius-md` | `8px` | `▣` redondeado medio | Inputs, selects, botones secundarios |
| `--radius-lg` | `12px` | `⬜` bien redondeado | Cards, paneles, dialogs |
| `--radius-xl` | `16px` | `🔲` muy redondeado | Modales, drawers |
| `--radius-pill` | `999px` | `⬭` cápsula completa | Botones primary, badges, chips y status badges |

---

# 🧩 Asignación por componente

| Componente | Token |
|---|---|
| `ButtonComponent` | `--radius-pill` |
| `InputComponent` | `--radius-md` |
| `SelectFilter` | `--radius-md` |
| `SearchFilter` | `--radius-md` |
| `CardComponent` | `--radius-lg` |
| `KpiCardComponent` | `--radius-lg` |
| `ConfirmDialogComponent` | `--radius-xl` |
| `KeywordConfirmModal` | `--radius-xl` |
| `StatusBadgeComponent` | `--radius-pill` |
| `AlertComponent` | `--radius-md` |

---

# 💡 Ejemplos en código

## ✅ Correcto

```scss
.badge {
  border-radius: var(--radius-pill);
}

.input-field {
  border-radius: var(--radius-md);
}

.card {
  border-radius: var(--radius-lg);
}
```

## ❌ Incorrecto

```scss
.badge {
  border-radius: 20px;
}

.input-field {
  border-radius: 6px;
}

.card {
  border-radius: 0.75rem;
}
```

---

# ⚠️ Error común

Mezclar radios sin intención hace que los componentes parezcan de sistemas distintos.

- Si parece un botón → `pill`
- Si es un contenedor → `lg` o `xl`
- Si es un control de formulario → `md`

---

# 🧱 Recomendación para Angular

Archivo recomendado:

```bash
src/styles/tokens/_radius.scss
```

Ejemplo:

```scss
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;
}
```

Importación global:

```scss
@use './styles/tokens/radius';
```

---

# 🚫 Reglas del proyecto

- No usar radios arbitrarios.
- Todo border-radius debe salir de un token.
- No mezclar radios sin intención visual.
- Mantener consistencia entre componentes similares.
