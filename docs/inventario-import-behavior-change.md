# Inventario — Import behavior change (import-complemento-y-excel-contrato)

## "Cargar datos internos" (formerly "Importar bienes")

The "Importar bienes" action has been renamed to **"Cargar datos internos"** throughout
the UI (button label, modal title, and process button).

The behavior of this import has also changed significantly:

| Behavior | Before | After |
|---|---|---|
| Creates new products | Yes (upsert) | **No** — products not found are skipped and reported |
| Updates description | Yes (overwrites) | **Never** — description is protected |
| Updates vrlAdjudicado / vrlAntes | Yes (overwrites) | **Never** — contract prices are protected |
| Updates IVA | Yes (overwrites) | **Never** — IVA is protected |
| Updates codigoSena / categoria / stockMinimo | Yes | Yes (only if field is currently empty) |
| Requires active contract | No | **Yes** — blocked if no active contract exists in date range |

**Migration note**: If you were relying on "Importar bienes" to seed product prices,
use "Importar contrato" instead. The contract import remains authoritative and creates
or fully updates products from the Excel/CSV file.

## Contrato import — Excel support added

The "Importar contrato" modal now accepts `.xlsx` and `.xls` files in addition to `.csv`.

- File input `accept` updated to `.xlsx,.xls,.csv`.
- `.xlsx` / `.xls` → multipart POST to `POST /api/v1/catalog/contratos/importar-excel`  
  with contract header fields (`numero`, `vigencia`, `fechaInicio`, `fechaFin`, `descripcion`)
  sent as FormData fields alongside the file.
- `.csv` → existing CSV flow is unchanged.
- Any other extension → validation error shown in UI, no payload emitted.

Response shape is unchanged: `{ contratoId, productosCreados, productosActualizados }`.

## Error handling

The backend returns errors as `ProblemDetail`. The relevant error message is in the
`detail` field (not `title`). The frontend propagates the full HTTP error to the
component for display.
