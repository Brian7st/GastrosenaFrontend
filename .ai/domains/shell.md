# Dominio: Shell

**Equipo propietario:** Equipo Arquitectura
**RF relacionados:** Estructura general de la app, routing principal

## Podés modificar
- `libs/shell/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio (`libs/cocina/`, `libs/auth/`, etc.)
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`
- `libs/shell/shell/src/lib/shell.routes.ts` — coordiná con Arquitectura

## Scope de tus ramas y commits
`feat/shell/...` | `fix/shell/...` | `chore/shell/...`

## Componentes únicos de este dominio
- `ShellComponent` — layout principal con sidebar y topbar
- `HomeComponent` — landing page con formulario de comentarios
- `shell.routes.ts` — routing de alto nivel (solo Arquitectura lo toca)
