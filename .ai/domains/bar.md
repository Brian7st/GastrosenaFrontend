# Dominio: Bar

**Equipo propietario:** Equipo Bar (2 personas)
**RF relacionados:** RF-C 4.10 – 4.19

## Podés modificar
- `libs/bar/**`

## Solo lectura
- `libs/shared/**`

## Nunca tocás
- Cualquier otro dominio

## Scope
`feat/bar/...` | `fix/bar/...` | `chore/bar/...`

## Componentes únicos de este dominio
- `DrinkQueueComponent` — cola de bebidas
- `BarStatsComponent` — estadísticas de tiempos del bar

## Estructura de carpetas

```
libs/bar/bar/src/lib/
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
│   └── bar.facade.ts
├── models/
├── pipes/
├── validators/
└── util/
```
