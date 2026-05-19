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

## Conectar vistas al backend

Cuando vayas a reemplazar los mocks de una vista con HTTP real, usá estos prompts:

**Paso 1 — Iniciá la conversación** con el contenido de `.ai/prompts/conectar-vista-backend.md`
**Paso 2 — Agregá al final** el archivo específico de la vista:

| Vista | Archivo de prompt |
|---|---|
| Bienes | `.ai/prompts/vistas/bienes.md` |
| Facturas | `.ai/prompts/vistas/facturas.md` |
| Solicitudes GIL | `.ai/prompts/vistas/solicitudes-gil.md` |
| Alertas | `.ai/prompts/vistas/alertas.md` |
| Presupuesto | `.ai/prompts/vistas/presupuesto.md` |
| Actas | `.ai/prompts/vistas/actas.md` |
| Paquete Probatorio | `.ai/prompts/vistas/paquete-probatorio.md` |
| Requisiciones | `.ai/prompts/vistas/requisiciones.md` |
| Kardex | `.ai/prompts/vistas/kardex.md` |
| Conciliación | `.ai/prompts/vistas/conciliacion.md` |
| Consolidado | `.ai/prompts/vistas/consolidado.md` |

---

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
