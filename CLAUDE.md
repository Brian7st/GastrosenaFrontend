# GastroSENA — Reglas para Claude Code

## ANTES DE CUALQUIER CAMBIO — obligatorio

Lee `.ai/protocol.md` y seguí el protocolo completo.
No escribas código hasta completar las preguntas del protocolo.

## Reglas de arquitectura
Lee `.ai/rules/architecture.md`

## Reglas de calidad
Lee `.ai/rules/code-quality.md`

## Reglas de Git
Lee `.ai/rules/git.md`

## Reglas por dominio
Cuando el dev confirme su dominio, leé `.ai/domains/{dominio}.md`

## Restricciones absolutas

- No modificar `libs/shared/**` sin confirmación explícita del equipo de Arquitectura
- No modificar `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`
- No instalar dependencias sin aprobar con el tech lead
- No crear archivos fuera del dominio asignado
- No usar `any` en TypeScript
- No hacer commits sin seguir el formato Conventional Commits

## Stack del proyecto

- Angular 20 (standalone components, signals)
- NgRx 20 (store, effects, facades)
- Nx 20 (monorepo, module boundaries)
- TypeScript strict
- SCSS con design tokens en `libs/shared/ui/src/lib/tokens/_variables.scss`
