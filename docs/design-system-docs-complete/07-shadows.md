# 🌑 Sistema de Sombras

> Las sombras comunican elevación y jerarquía.
> Una sombra más grande significa un elemento más cercano al usuario.
> Las sombras no se usan como decoración.

---

# 📏 Escala de elevación

| Token | Valor CSS | Elevación | Cuándo usar |
|---|---|---|---|
| `--shadow-xs` | `0 1px 3px rgba(0,0,0,0.06)` | Mínima | Separadores sutiles y elementos casi planos |
| `--shadow-sm` | `0 2px 6px rgba(0,0,0,0.08)` | Baja | Inputs con foco y dropdowns pequeños |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.1)` | Media | Tooltips, popovers y menús |
| `--shadow-card` | `0 4px 20px rgba(0,0,0,0.03)` | Card en reposo | Cards, paneles y secciones |
| `--shadow-card-hover` | `0 8px 32px rgba(0,0,0,0.06)` | Card activa | Cards en hover |
| `--shadow-hover` | `0 4px 20px rgba(0,0,0,0.08)` | Elevada | Elementos que suben en hover |
| `--shadow-subtle` | `0 4px 24px rgba(0,0,0,0.04)` | Muy sutil | DataTable y contenedores de datos |

---

# 🎨 Sombras de marca

| Token | Valor CSS | Uso |
|---|---|---|
| `--shadow-primary` | `0 8px 20px rgba(57,169,0,0.2)` | Botón primary en reposo |
| `--shadow-primary-hover` | `0 12px 28px rgba(57,169,0,0.3)` | Botón primary en hover |

---

# 🎯 Focus ring

| Token | Valor CSS | Uso |
|---|---|---|
| `--focus-ring` | `0 0 0 3px rgba(57,169,0,0.3)` | Elementos interactivos con foco de teclado |

> El `focus-ring` debe aplicarse únicamente en `:focus-visible`.
> Nunca usarlo en `:focus` para evitar anillos visuales con clics de mouse.

---

# 💡 Cómo usar

## ✅ Correcto

```scss
.mi-card {
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration-fast) var(--ease-standard);

  &:hover {
    box-shadow: var(--shadow-card-hover);
  }
}

.mi-input:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

## ❌ Incorrecto

```scss
.mi-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}
```

---

# ⚠️ Errores comunes

| Error | Corrección |
|---|---|
| Usar sombras como decoración | Usarlas únicamente para comunicar elevación |
| Hardcodear sombras | Utilizar tokens oficiales |
| Sombras demasiado oscuras | Mantener la sutileza del sistema |
| Aplicar `focus-ring` en `:focus` | Aplicarlo solo en `:focus-visible` |
| Usar múltiples sombras diferentes en una misma vista | Mantener consistencia visual |

---

# 🧱 Recomendación para Angular

Archivo recomendado:

```bash
src/styles/tokens/_shadows.scss
```

Ejemplo:

```scss
:root {
  --shadow-xs: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-sm: 0 2px 6px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);

  --shadow-card: 0 4px 20px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.06);

  --shadow-primary: 0 8px 20px rgba(57,169,0,0.2);
  --shadow-primary-hover: 0 12px 28px rgba(57,169,0,0.3);

  --focus-ring: 0 0 0 3px rgba(57,169,0,0.3);
}
```

Importación global:

```scss
@use './styles/tokens/shadows';
```

---

# 🚫 Reglas del proyecto

- No usar sombras hardcodeadas.
- Toda sombra debe salir de un token.
- Las sombras comunican elevación, no decoración.
- Mantener progresión visual coherente.
- El `focus-ring` es obligatorio en elementos interactivos accesibles.
