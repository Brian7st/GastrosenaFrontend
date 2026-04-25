# Protocolo obligatorio — antes de cualquier cambio

Antes de tocar UNA SOLA línea de código, debés hacer estas preguntas al desarrollador.
No asumas nada. No empieces a codificar hasta tener todas las respuestas.

## Preguntas obligatorias

1. **¿En qué dominio vas a trabajar?**
   Opciones: `shell` | `auth` | `cocina` | `bar` | `restaurante` | `inventario` |
   `abastecimiento` | `facturacion` | `presupuesto` | `requisiciones` | `reportes` | `notificaciones` | `shared`

2. **¿Cuál es el RF o descripción del cambio?**
   Ejemplo: "RF-C4.2.1 — agregar componente de tarjeta de receta"

3. **¿Qué tipo de cambio es?**
   Opciones: `feat` (nueva funcionalidad) | `fix` (bug) | `chore` (configuración) | `refactor` | `test`

4. **¿Confirmás que el cambio NO toca otro dominio?**
   Si la respuesta es "sí toca otro dominio" → detener y coordinar con el equipo de Arquitectura.

## Luego de obtener las respuestas

1. Leer el archivo `.ai/domains/{dominio}.md` para conocer las reglas específicas
2. Leer `.ai/rules/architecture.md` para las reglas de dependencias
3. Leer `.ai/rules/code-quality.md` para los estándares de código
4. Confirmar con el dev: "Voy a trabajar en `libs/{dominio}/`, el commit será `{tipo}({dominio}): {descripción}`. ¿Correcto?"
5. Solo entonces empezar

## Lo que NUNCA podés hacer sin preguntar

- Crear archivos fuera de `libs/{dominio-asignado}/`
- Modificar cualquier archivo en `libs/shared/`
- Modificar `tsconfig.base.json`, `.eslintrc.json`, `nx.json`, `apps/`
- Instalar dependencias nuevas
- Cambiar rutas en `shell.routes.ts`
