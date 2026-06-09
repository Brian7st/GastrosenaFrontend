import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Genera un .xlsx en memoria con las filas dadas. */
function buildXlsx(rows: Record<string, string | number>[]): Buffer {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bienes');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

async function abrirImportar(page: import('@playwright/test').Page) {
  await page.goto('/app/inventario/bienes');
  const importar = page.getByRole('button', { name: /Importar/i }).first();
  await expect(importar).toBeVisible();
  await importar.click();
  await expect(page.locator('input[type="file"]')).toBeAttached();
}

test.describe('Inventario · Bienes · Importar Excel (contra backend real)', () => {
  test('importar .xlsx válido carga los bienes en el backend (camino feliz)', async ({ page }) => {
    const ts = Date.now();
    const xlsx = buildXlsx([
      { codigoSena: `IMP-${ts}-1`, descripcion: 'Harina E2E', categoria: 'ALIMENTOS', unidadMedida: 'KG', vrlAdjudicado: 3500, iva: 0 },
      { codigoSena: `IMP-${ts}-2`, descripcion: 'Aceite E2E', categoria: 'ALIMENTOS', unidadMedida: 'L', vrlAdjudicado: 9000, iva: 19 },
    ]);

    await abrirImportar(page);
    await page.locator('input[type="file"]').setInputFiles({
      name: 'bienes-e2e.xlsx', mimeType: XLSX_MIME, buffer: xlsx,
    });

    const procesar = page.getByRole('button', { name: /Procesar|Importar/i }).last();
    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/v1/catalog/productos/importar-excel') && r.request().method() === 'POST',
        { timeout: 25_000 },
      ),
      procesar.click(),
    ]);
    expect([200, 201]).toContain(resp.status());
  });

  test('importar .xlsx sin codigoSena es rechazado por el backend (camino malo)', async ({ page }) => {
    const xlsx = buildXlsx([
      { descripcion: 'Sin codigo E2E', categoria: 'ALIMENTOS', unidadMedida: 'KG' },
    ]);

    await abrirImportar(page);
    await page.locator('input[type="file"]').setInputFiles({
      name: 'bienes-malo.xlsx', mimeType: XLSX_MIME, buffer: xlsx,
    });

    const procesar = page.getByRole('button', { name: /Procesar|Importar/i }).last();
    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/v1/catalog/productos/importar-excel') && r.request().method() === 'POST',
        { timeout: 25_000 },
      ),
      procesar.click(),
    ]);
    expect(resp.status(), 'el backend debe rechazar el lote sin codigoSena').toBeGreaterThanOrEqual(400);
  });
});
