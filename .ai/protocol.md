# Protocolo de inicio — obligatorio antes de cualquier cambio

> **Regla de oro:** no escribís una sola línea de código hasta completar este protocolo.

---

## Paso 1 — Hacé estas 4 preguntas

| # | Pregunta | Opciones válidas |
|---|----------|-----------------|
| 1 | ¿En qué dominio trabajás? | `shell` · `auth` · `cocina` · `bar` · `restaurante` · `inventario` · `abastecimiento` · `reportes` · `notificaciones` · `shared` |
| 2 | ¿Cuál es el RF o descripción del cambio? | Ej: `RF-C4.2.1 — agregar tarjeta de receta` |
| 3 | ¿Qué tipo de cambio es? | `feat` · `fix` · `chore` · `refactor` · `test` |
| 4 | ¿El cambio toca solo ese dominio? | Si toca otro → **detener y coordinar con Arquitectura** |

---

## Paso 2 — Leé los archivos del dominio

```
.ai/domains/{dominio}.md     ← reglas específicas del dominio
.ai/rules/architecture.md    ← dependencias entre módulos
.ai/rules/code-quality.md    ← estándares de código
```

---

## Paso 3 — Confirmá antes de empezar

Decile al dev exactamente:

> "Voy a trabajar en `libs/{dominio}/`, el commit será `{tipo}({dominio}): {descripción}`. ¿Correcto?"

Solo arrancás cuando el dev confirma.

---

## Prohibido sin preguntar — siempre

| Acción prohibida | Por qué |
|-----------------|---------|
| Crear archivos fuera de `libs/{dominio-asignado}/` | Rompe el aislamiento de dominio |
| Modificar cualquier archivo en `libs/shared/` | Requiere aprobación de Arquitectura |
| Modificar `tsconfig.base.json`, `.eslintrc.json`, `nx.json`, `apps/` | Afecta toda la plataforma |
| Instalar dependencias nuevas | Requiere aprobación del tech lead |
| Cambiar rutas en `shell.routes.ts` | Impacto global de navegación |
