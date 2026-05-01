# Dominio: Inventario

**Equipo propietario:** Equipo Inventario (3 personas)
**RF relacionados:** RF-5.1, RF-5.5, RF-5.6, RF-5.8

## Podés modificar
- `libs/inventario/**`

## Solo lectura
- `libs/shared/**`

## Nunca tocás
- Cualquier otro dominio

## Scope
`feat/inventario/...` | `fix/inventario/...` | `chore/inventario/...`

## Componentes únicos de este dominio
- `StockAlertBannerComponent` — alerta visual de stock crítico
- `StockLevelIndicatorComponent`
- `BienDetailCardComponent`

## Estructura de carpetas

```
libs/inventario/inventario/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── bienes-page/
│   ├── facturas-page/
│   ├── solicitudes-page/
│   ├── consolidado-page/
│   ├── kardex-page/
│   ├── alertas-page/
│   ├── presupuesto-page/
│   ├── conciliacion-page/
│   ├── requisiciones-page/
│   ├── actas-page/
│   └── paquete-probatorio-page/
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── inventario.facade.ts
├── models/
├── pipes/
├── validators/
└── util/
```
