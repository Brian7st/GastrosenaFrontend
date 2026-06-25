# Dominio: Configuración

**Equipo propietario:** Equipo Configuración
**RF relacionados:** Configuración general del sistema

## Podés modificar
- `libs/configuracion/**`

## Solo lectura
- `libs/shared/**`

## Nunca tocás
- `libs/shared/auth/`
- `libs/shell/shell/src/lib/shell.routes.ts` — solo agregar la ruta, no modificar estructura
- `libs/shell/shell/src/lib/nav/nav-config.ts` — solo agregar item, no modificar items existentes

## Scope
`feat(configuracion): ...` | `fix(configuracion): ...` | `chore(configuracion): ...`

## Estructura de carpetas

```
libs/configuracion/configuracion/src/lib/
├── pages/
│   ├── config-page/
│   └── bien-delete-page/
├── components/
│   └── config-section/
├── data-access/
│   ├── configuracion.facade.ts
│   └── configuracion.service.ts
├── models/
│   └── configuracion.model.ts
└── util/
    └── index.ts
```
