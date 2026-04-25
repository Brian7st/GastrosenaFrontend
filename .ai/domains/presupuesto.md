# Dominio: Presupuesto

**Equipo propietario:** Equipo Presupuesto (2 personas)
**RF relacionados:** RF-P — techos presupuestarios y ZESE

## Podés modificar
- `libs/presupuesto/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`

## Scope de tus ramas y commits
`feat/presupuesto/...` | `fix/presupuesto/...` | `chore/presupuesto/...`

## Componentes únicos de este dominio
- `BudgetOverviewComponent` — resumen de techos por área
- `ZeseFormComponent` — formulario ZESE
- `BudgetAlertComponent` — alerta de techo superado
