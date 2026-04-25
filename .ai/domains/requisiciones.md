# Dominio: Requisiciones

**Equipo propietario:** Equipo Requisiciones (2 personas)
**RF relacionados:** RF-Q — requisiciones y actas de entrega

## Podés modificar
- `libs/requisiciones/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`

## Scope de tus ramas y commits
`feat/requisiciones/...` | `fix/requisiciones/...` | `chore/requisiciones/...`

## Componentes únicos de este dominio
- `RequisicionFormComponent` — formulario de nueva requisición
- `RequisicionListComponent` — listado con estados
- `ActaEntregaComponent` — acta de entrega firmada
