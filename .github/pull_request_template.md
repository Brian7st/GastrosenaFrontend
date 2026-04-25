## Descripción
<!-- Qué hace este PR y por qué es necesario -->

## Tipo de cambio
- [ ] `feat` — nueva funcionalidad
- [ ] `fix` — corrección de bug
- [ ] `chore` — configuración, dependencias, refactor sin lógica
- [ ] `test` — tests únicamente

## Scope
<!-- Un solo scope por PR — ver ARQUITECTURA.md sección 10 -->
- [ ] `shell` · [ ] `auth` · [ ] `shared`
- [ ] `cocina` · [ ] `bar` · [ ] `restaurante`
- [ ] `inventario` · [ ] `abastecimiento` · [ ] `presupuesto`
- [ ] `requisiciones` · [ ] `reportes` · [ ] `usuarios`

## Checklist obligatorio
- [ ] `nx affected:lint --base=develop` → 0 errores
- [ ] `nx affected:test --base=develop` → 0 fallos
- [ ] PR tiene menos de 400 líneas modificadas
- [ ] Un solo scope tocado
- [ ] Todo componente nuevo tiene su `.spec.ts`
- [ ] Sin `any` en TypeScript
- [ ] Sin estilos inline en templates
- [ ] Sin colores/espaciados fuera de `_variables.scss`

## Cambios principales
<!--
- Agregué X porque Y
- Modifiqué Z para resolver W
-->

## RF relacionado
<!-- Ej: RF-C4.2.1 — Recipe card component -->
