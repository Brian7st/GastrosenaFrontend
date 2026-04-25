# CONTRIBUTING

## Reglas de arquitectura

1. No importar de otro `feature-*` directamente.
2. No importar de `feature-*` dentro de `shared/`.
3. No redefinir interfaces que existen en `shared/models/`.
4. No definir colores, espaciados ni tipografía fuera de `libs/shared/ui/src/lib/tokens/_variables.scss`.

## Reglas de Git

1. Formato de rama: `{tipo}/{scope}/{descripcion}`.
2. Un scope por PR.
3. Máximo 400 líneas por PR.
4. Validar `nx affected:lint --base=develop` y `nx affected:test --base=develop` antes del PR.
5. No self-merge.
6. Conventional Commits obligatorio.

## Reglas de calidad

1. Todo componente nuevo lleva su `.spec.ts`.
2. Todo servicio nuevo lleva su `.spec.ts`.
3. Coverage mínimo 70% por librería.
4. No `any` en TypeScript.
5. No estilos inline en templates.
