# Dominio: Cocina

**Equipo propietario:** Equipo Cocina (2 personas)
**RF relacionados:** RF-C 4.0 – 4.9

## Podés modificar
- `libs/cocina/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio (`libs/bar/`, `libs/inventario/`, etc.)
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`
- `libs/shell/shell/src/lib/shell.routes.ts` — coordiná con Arquitectura

## Scope de tus ramas y commits
`feat/cocina/...` | `fix/cocina/...` | `chore/cocina/...`

## Componentes únicos de este dominio
- `KitchenBoardComponent` — tablero de pedidos en tiempo real
- `OrderTimerComponent` — contador de tiempo por pedido
- `RecipeStepsComponent` — pasos de preparación

## Estructura de carpetas

```
libs/cocina/cocina/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── comandas-page/
│   ├── recetas-page/
│   └── menu-page/
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── cocina.facade.ts
├── models/
├── pipes/
├── validators/
└── util/
```
