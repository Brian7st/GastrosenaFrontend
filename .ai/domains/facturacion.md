# Dominio: Facturación

**Equipo propietario:** Equipo Facturación (2 personas)
**RF relacionados:** RF-F — FEL y facturas electrónicas

## Podés modificar
- `libs/facturacion/**`

## Solo lectura
- `libs/shared/**` — podés importar, nunca modificar

## Nunca tocás
- Cualquier otro dominio
- `apps/`, `tsconfig.base.json`, `.eslintrc.json`, `nx.json`

## Scope de tus ramas y commits
`feat/facturacion/...` | `fix/facturacion/...` | `chore/facturacion/...`

## Componentes únicos de este dominio
- `InvoiceListComponent` — listado de facturas emitidas
- `FelFormComponent` — formulario de emisión FEL
- `InvoiceDetailComponent` — detalle y descarga de factura
