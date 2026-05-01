# Dominio: Reportes

**Equipo propietario:** Equipo Reportes (2 personas)
**RF relacionados:** RF-R — exportables PDF/Excel

## Podés modificar
- `libs/reportes/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`

## Scope de tus ramas y commits
`feat/reportes/...` | `fix/reportes/...` | `chore/reportes/...`

## Componentes únicos de este dominio
- `ReportSelectorComponent` — selección de tipo de reporte
- `PdfExportService` — generación de PDF
- `ExcelExportService` — generación de Excel

## Estructura de carpetas

```
libs/reportes/reportes/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── ventas-page/
│   └── inventario-reportes-page/
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── reportes.facade.ts
├── models/
├── pipes/
├── validators/
└── util/
```
