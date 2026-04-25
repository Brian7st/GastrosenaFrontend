# Dominio: Notificaciones

**Equipo propietario:** Equipo Arquitectura / Backend
**RF relacionados:** RF-N — alertas en tiempo real

## Podés modificar
- `libs/notificaciones/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`

## Scope de tus ramas y commits
`feat/notificaciones/...` | `fix/notificaciones/...` | `chore/notificaciones/...`

## Componentes únicos de este dominio
- `NotificationBellComponent` — ícono con badge de alertas
- `NotificationPanelComponent` — panel lateral de notificaciones
- `NotificationService` — conexión WebSocket / SSE
