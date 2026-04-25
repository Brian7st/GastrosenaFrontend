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
