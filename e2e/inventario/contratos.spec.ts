import { test, expect, Page } from '@playwright/test';
import * as XLSX from 'xlsx';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function buildContratoXlsx(rows: Record<string, string | number>[]): Buffer {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contrato');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function abrirVistaContratos(page: Page): Promise<void> {
  await page.goto('/app/inventario/bienes');
  await page.getByRole('button', { name: /Contratos/i }).click();
  await expect(page.getByRole('button', { name: /Importar contrato/i })).toBeVisible();
}

async function importarContratoExcel(page: Page): Promise<{ numero: string; bienCodigo: string; bienDescripcion: string }> {
  const ts = Date.now();
  const numero = `CTO-E2E-${ts}`;
  const descripcion = `Contrato E2E ${ts}`;
  const bienCodigo = `CTR-${ts}-1`;
  const bienDescripcion = `Harina contrato E2E ${ts}`;
  const xlsx = buildContratoXlsx([
    {
      refArticulo: `REF-${ts}-1`,
      codigoSena: bienCodigo,
      descripcion: bienDescripcion,
      unidadMedida: 'KG',
      cantidad: 100,
      codigoProveedor: `PROV-${ts}`,
      valorEstimado: 3800,
      vrlAdjudicado: 3500,
      vrlAntes: 2941,
      ivaPorcentaje: 0.19,
    },
  ]);

  await abrirVistaContratos(page);
  await page.getByRole('button', { name: /Importar contrato/i }).click();

  const dialog = page.locator('.import-dialog');
  await expect(dialog.getByRole('heading', { name: /Importar Contrato/i })).toBeVisible();

  await dialog.locator('input[placeholder="CTO-2025-001"]').fill(numero);
  await dialog.locator('input[type="number"]').fill('2026');
  await dialog.locator('input[placeholder="Contrato de insumos 2025"]').fill(descripcion);
  await dialog.locator('input[type="date"]').nth(0).fill('2026-01-01');
  await dialog.locator('input[type="date"]').nth(1).fill('2026-12-31');
  await dialog.locator('input[type="file"]').setInputFiles({
    name: 'contrato-e2e.xlsx',
    mimeType: XLSX_MIME,
    buffer: xlsx,
  });

  const importar = dialog.getByRole('button', { name: /Importar Contrato/i });
  await expect(importar).toBeEnabled();

  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/catalog/contratos/importar-excel') && r.request().method() === 'POST',
      { timeout: 25_000 },
    ),
    importar.click(),
  ]);

  expect([200, 201]).toContain(resp.status());
  await expect(page.getByText(/Contrato importado:/i)).toBeVisible();
  await expect(page.getByText(numero)).toBeVisible();

  return { numero, bienCodigo, bienDescripcion };
}

async function cargarDatosInternos(page: Page, bienCodigo: string, bienDescripcion: string): Promise<void> {
  const xlsx = buildContratoXlsx([
    {
      codigoSena: bienCodigo,
      descripcion: bienDescripcion,
      categoria: 'ALIMENTOS',
      unidadMedida: 'KG',
      codigoProveedor: 'PROV-COMPLEMENTO',
      vrlAdjudicado: 9999,
      vrlAntes: 8402,
      iva: 19,
      stockMinimo: 77,
    },
  ]);

  await page.getByRole('button', { name: /Bienes/i }).click();
  await page.getByRole('button', { name: /Cargar datos internos/i }).click();

  const dialog = page.locator('.import-dialog');
  await expect(dialog.getByRole('heading', { name: /Cargar datos internos/i })).toBeVisible();
  await dialog.locator('input[type="file"]').setInputFiles({
    name: 'datos-internos-e2e.xlsx',
    mimeType: XLSX_MIME,
    buffer: xlsx,
  });

  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/catalog/productos/importar-excel') && r.request().method() === 'POST',
      { timeout: 25_000 },
    ),
    dialog.getByRole('button', { name: /Cargar datos internos/i }).click(),
  ]);
  expect([200, 201]).toContain(resp.status());
}

test.describe('Inventario · Contratos (contra backend real)', () => {
  test('importar contrato Excel crea el contrato y actualiza bienes (camino feliz)', async ({ page }) => {
    await importarContratoExcel(page);
  });

  test('cargar datos internos complementa un bien de contrato sin pisar precio', async ({ page }) => {
    const { bienCodigo, bienDescripcion } = await importarContratoExcel(page);

    await cargarDatosInternos(page, bienCodigo, bienDescripcion);
    await page.getByPlaceholder(/Buscar por código o nombre/i).fill(bienDescripcion);

    const bienRow = page.getByRole('row', { name: new RegExp(escapeRegExp(bienDescripcion)) });
    await expect(bienRow).toBeVisible();
    await expect(bienRow).toContainText('77');
    await expect(bienRow).toContainText('$3,500');
  });

  test('cerrar contrato desactiva sus bienes asociados (camino feliz)', async ({ page }) => {
    const { numero, bienDescripcion } = await importarContratoExcel(page);
    const row = page.getByRole('row', { name: new RegExp(escapeRegExp(numero)) });

    await expect(row).toBeVisible();
    await row.locator('button[title="Cerrar contrato"]').click();

    await expect(page.getByRole('heading', { name: /Cerrar contrato/i })).toBeVisible();

    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/v1\/catalog\/contratos\/[^/]+\/cerrar$/.test(r.url()) && r.request().method() === 'PATCH',
        { timeout: 20_000 },
      ),
      page.getByRole('button', { name: /cerrar contrato/i }).click(),
    ]);

    expect(resp.status()).toBe(200);
    await expect(page.getByText(/Contrato cerrado:/i)).toBeVisible();

    await page.getByRole('button', { name: /Bienes/i }).click();
    await page.getByPlaceholder(/Buscar por código o nombre/i).fill(bienDescripcion);

    const bienRow = page.getByRole('row', { name: new RegExp(escapeRegExp(bienDescripcion)) });
    await expect(bienRow).toBeVisible();
    await expect(bienRow.getByText('Inactivo')).toBeVisible();
  });
});
