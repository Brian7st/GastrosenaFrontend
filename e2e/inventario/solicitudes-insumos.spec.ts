import { test, expect, Page } from '@playwright/test';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function crearBienActivo(page: Page): Promise<{ codigo: string; descripcion: string }> {
  await page.goto('/app/inventario/bienes');
  await page.getByRole('button', { name: /Nuevo Bien/i }).click();

  const codigo = `SOL-E2E-${Date.now()}`;
  const descripcion = `Insumo solicitud ${codigo}`;

  await page.locator('input[formcontrolname="codigoSena"]').fill(codigo);
  await page.locator('input[formcontrolname="descripcion"]').fill(descripcion);
  await page.locator('select[formcontrolname="categoria"]').selectOption({ index: 1 });
  await page.locator('select[formcontrolname="unidadMedida"]').selectOption('UND');
  await page.locator('input[formcontrolname="stockMinimo"]').fill('5');
  await page.locator('input[formcontrolname="vrlAdjudicado"]').fill('4200');
  await page.locator('input[formcontrolname="iva"]').fill('19');

  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/catalog/productos') && r.request().method() === 'POST',
      { timeout: 20_000 },
    ),
    page.getByRole('button', { name: /Guardar Bien/i }).click(),
  ]);
  expect([200, 201]).toContain(resp.status());

  await page.getByPlaceholder(/Buscar por código o nombre/i).fill(descripcion);
  await expect(page.getByRole('row', { name: new RegExp(escapeRegExp(descripcion)) })).toBeVisible();

  return { codigo, descripcion };
}

async function crearSolicitudConBien(page: Page): Promise<{ instructor: string; ficha: string; codigoBien: string }> {
  const bien = await crearBienActivo(page);
  const suffix = Date.now();
  const instructor = `Instructor E2E ${suffix}`;
  const ficha = `FICHA-${suffix}`;

  await page.goto('/app/inventario/solicitudes-insumos-page/nueva');
  await expect(page.getByRole('heading', { name: /Nueva Solicitud de Insumos/i })).toBeVisible();

  await page.getByPlaceholder(/Ej\. 2560892/i).fill(ficha);
  await page.getByPlaceholder(/Ej\. GASTRONOMÍA/i).fill(`Programa E2E ${suffix}`);
  await page.getByPlaceholder(/Ej\. Carlos Rodríguez/i).fill(instructor);
  await page.getByPlaceholder(/Ej\. 1234567890/i).fill(`10${suffix}`.slice(0, 10));

  await page.getByRole('button', { name: /Agregar desde catálogo/i }).click();
  const catalog = page.locator('.catalog-modal');
  await expect(catalog.getByRole('heading', { name: /Catálogo de Bienes/i })).toBeVisible();
  await catalog.getByPlaceholder(/Buscar por nombre o código SENA/i).fill(bien.codigo);

  const catalogRow = catalog.getByRole('row', { name: new RegExp(escapeRegExp(bien.codigo)) });
  await expect(catalogRow).toBeVisible();
  await catalogRow.getByRole('button', { name: /Agregar/i }).click();

  const itemRow = page.getByRole('row', { name: new RegExp(escapeRegExp(bien.codigo)) });
  await expect(itemRow).toBeVisible();
  await itemRow.locator('input[type="number"]').first().fill('3');
  await itemRow.locator('input[placeholder="Ej. ALM-01"]').fill(`ALM-${suffix}`);

  await page.getByRole('button', { name: /Enviar solicitud/i }).click();
  await expect(page.getByRole('heading', { name: /Enviar solicitud/i })).toBeVisible();

  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/training/solicitudes') && r.request().method() === 'POST',
      { timeout: 20_000 },
    ),
    page.locator('.modal-container .btn-confirm').click(),
  ]);
  expect(resp.status()).toBe(201);

  await expect(page).toHaveURL(/\/app\/inventario\/solicitudes-insumos-page$/);
  await page.getByPlaceholder(/Buscar por instructor o código/i).fill(instructor);

  const row = page.getByRole('row', { name: new RegExp(escapeRegExp(instructor)) });
  await expect(row).toBeVisible();
  await expect(row).toContainText(ficha);
  await expect(row).toContainText('CREADA');
  await expect(row).toContainText('1 ítems');

  return { instructor, ficha, codigoBien: bien.codigo };
}

test.describe('Inventario · Solicitudes de insumos (contra backend real)', () => {
  test('valida campos obligatorios antes de enviar (camino malo)', async ({ page }) => {
    await page.goto('/app/inventario/solicitudes-insumos-page/nueva');

    await page.getByRole('button', { name: /Enviar solicitud/i }).click();

    await expect(page.getByText(/La ficha de caracterización es requerida/i)).toBeVisible();
    await expect(page.getByText(/El programa de formación es requerido/i)).toBeVisible();
    await expect(page.getByText(/El nombre del instructor es obligatorio/i)).toBeVisible();
    await expect(page.getByText(/Debe agregar al menos un ítem/i)).toBeVisible();
    await expect(page.locator('.modal-container')).toBeHidden();
  });

  test('crear solicitud desde catálogo la persiste en estado CREADA (camino feliz)', async ({ page }) => {
    await crearSolicitudConBien(page);
  });

  test('aprobar y comprometer solicitud actualiza el estado en la bandeja (camino feliz)', async ({ page }) => {
    const { instructor } = await crearSolicitudConBien(page);
    const row = page.getByRole('row', { name: new RegExp(escapeRegExp(instructor)) });

    await row.locator('button[title="Aprobar Solicitud"]').click();
    await expect(page.getByRole('heading', { name: /Aprobar solicitud/i })).toBeVisible();

    const [aprobarResp] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/v1\/training\/solicitudes\/[^/]+\/aprobar$/.test(r.url()) && r.request().method() === 'PATCH',
        { timeout: 20_000 },
      ),
      page.getByRole('button', { name: /Confirmar aprobación/i }).click(),
    ]);
    expect(aprobarResp.status()).toBe(200);

    await expect(row).toContainText('APROBADA');

    const [comprometerResp] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/v1\/training\/solicitudes\/[^/]+\/comprometer$/.test(r.url()) && r.request().method() === 'PATCH',
        { timeout: 20_000 },
      ),
      row.locator('button[title="Comprometer Solicitud"]').click(),
    ]);
    expect(comprometerResp.status()).toBe(200);

    await expect(row).toContainText('COMPROMETIDA');
  });
});

