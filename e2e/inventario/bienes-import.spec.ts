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
  await page.getByRole('button', { name: /Cargar datos internos/i }).click();
  await expect(page.getByRole('heading', { name: /Cargar datos internos/i })).toBeVisible();
  await expect(page.locator('input[type="file"]')).toBeAttached();
}

/** Genera un .xlsx de contrato (hoja "Contrato") en memoria. */
function buildContratoXlsx(rows: Record<string, string | number>[]): Buffer {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contrato');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

/** Precondición real: importar bienes ("Cargar datos internos") exige un contrato vigente. */
async function seedContratoVigente(page: import('@playwright/test').Page): Promise<void> {
  const ts = Date.now();
  const xlsx = buildContratoXlsx([
    {
      refArticulo: `REF-${ts}-1`,
      codigoSena: `CTR-${ts}-1`,
      descripcion: `Bien contrato ${ts}`,
      unidadMedida: 'KG',
      cantidad: 100,
      codigoProveedor: `PROV-${ts}`,
      valorEstimado: 3800,
      vrlAdjudicado: 3500,
      vrlAntes: 2941,
      ivaPorcentaje: 0.19,
    },
  ]);
  await page.goto('/app/inventario/bienes');
  await page.getByRole('button', { name: /Contratos/i }).click();
  await page.getByRole('button', { name: /Importar contrato/i }).click();
  const dialog = page.locator('.import-dialog');
  await expect(dialog.getByRole('heading', { name: /Importar Contrato/i })).toBeVisible();
  await dialog.locator('input[placeholder="CTO-2025-001"]').fill(`CTO-IMP-${ts}`);
  await dialog.locator('input[type="number"]').fill('2026');
  await dialog.locator('input[placeholder="Contrato de insumos 2025"]').fill(`Contrato import ${ts}`);
  await dialog.locator('input[type="date"]').nth(0).fill('2026-01-01');
  await dialog.locator('input[type="date"]').nth(1).fill('2026-12-31');
  await dialog.locator('input[type="file"]').setInputFiles({
    name: 'contrato-e2e.xlsx', mimeType: XLSX_MIME, buffer: xlsx,
  });
  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/catalog/contratos/importar-excel') && r.request().method() === 'POST',
      { timeout: 25_000 },
    ),
    dialog.getByRole('button', { name: /Importar Contrato/i }).click(),
  ]);
  expect([200, 201]).toContain(resp.status());
}

test.describe('Inventario · Bienes · Importar Excel (contra backend real)', () => {
  test('importar .xlsx válido carga los bienes en el backend (camino feliz)', async ({ page }) => {
    await seedContratoVigente(page);
    const ts = Date.now();
    const xlsx = buildXlsx([
      { codigoSena: `IMP-${ts}-1`, descripcion: 'Harina E2E', categoria: 'ALIMENTOS', unidadMedida: 'KG', vrlAdjudicado: 3500, iva: 0 },
      { codigoSena: `IMP-${ts}-2`, descripcion: 'Aceite E2E', categoria: 'ALIMENTOS', unidadMedida: 'L', vrlAdjudicado: 9000, iva: 19 },
    ]);

    await abrirImportar(page);
    await page.locator('input[type="file"]').setInputFiles({
      name: 'bienes-e2e.xlsx', mimeType: XLSX_MIME, buffer: xlsx,
    });

    const procesar = page.locator('.import-dialog').getByRole('button', { name: /Cargar datos internos/i });
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

    const procesar = page.locator('.import-dialog').getByRole('button', { name: /Cargar datos internos/i });
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
