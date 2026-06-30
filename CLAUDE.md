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

## DOMINIO ACTIVO — Solo módulo Inventario

Toda sesión de trabajo está restringida al módulo de inventario:

- Única lib permitida: `libs/inventario/`
- Compartidos de solo lectura: `libs/shared/` (no modificar sin aprobación de Arquitectura)
- Contexto del trabajo: ver `BACKLOG_FRONTEND_ORGANIZADO.md` en la raíz (archivo local, no se sube al repo)
- NO tocar `libs/abastecimiento`, `libs/auth`, `libs/bar`, `libs/cocina`, `libs/notificaciones`, `libs/reportes`, `libs/restaurante`, `libs/shell`, ni `apps/`
- Si una tarea parece requerir tocar otro módulo, preguntar antes de proceder

### Estrategia de ejecución activa

**FASE VISUAL (en curso)** — Tareas sin dependencia de backend, ejecutar YA:
`FEL-03` → `SOL-03` → `SOL-05` → `SOL-06` → `PRE-02` → `PRE-03` → `CON-TF-03` → `BIENES-01` → `BIENES-03` → `SOL-01`

**FASE BACKEND (bloqueada)** — Esperar contratos confirmados del backend:
`F-01` → `F-02` → `F-03` → `F-04` → `F-05` → `F-06` → `F-07..F-14` → tareas dependientes (BIENES-02, SOL-02, SOL-07, PRE-01, CON-TF-01, CON-TF-04, ACTA-01..03, EXP-01..03)

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
