import { test, expect } from '@playwright/test';

async function crearBienParaAccion(page: import('@playwright/test').Page): Promise<string> {
  await page.goto('/app/inventario/bienes');
  await page.getByRole('button', { name: /Nuevo Bien/i }).click();

  const codigo = `E2E-ACT-${Date.now()}`;
  const descripcion = `Bien acciones ${codigo}`;
  await page.locator('input[formcontrolname="codigoSena"]').fill(codigo);
  await page.locator('input[formcontrolname="descripcion"]').fill(descripcion);
  await page.locator('select[formcontrolname="categoria"]').selectOption({ index: 1 });
  await page.locator('select[formcontrolname="unidadMedida"]').selectOption('UND');
  await page.locator('input[formcontrolname="stockMinimo"]').fill('5');
  await page.locator('input[formcontrolname="vrlAdjudicado"]').fill('1000');

  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/catalog/productos') && r.request().method() === 'POST',
      { timeout: 20_000 },
    ),
    page.getByRole('button', { name: /Guardar Bien/i }).click(),
  ]);
  expect([200, 201]).toContain(resp.status());

  await page.getByPlaceholder(/Buscar por código o nombre/i).fill(descripcion);
  await expect(page.getByRole('row', { name: new RegExp(descripcion) })).toBeVisible();

  return codigo;
}

/**
 * Acciones sobre un bien existente: editar y activar/desactivar (PATCH al backend real).
 * Crean/seleccionan datos propios para no depender del estado previo del backend.
 */
test.describe('Inventario · Bienes · acciones de fila', () => {
  test('editar un bien persiste el cambio (camino feliz)', async ({ page }) => {
    const codigo = await crearBienParaAccion(page);
    const row = page.getByRole('row', { name: new RegExp(codigo) });
    const editar = row.locator('button[title="Editar"]');
    await expect(editar).toBeVisible();
    await editar.click();

    const desc = page.locator('input[formcontrolname="descripcion"]');
    await expect(desc).toBeVisible();
    await desc.fill(`Editado E2E ${Date.now()}`);

    const guardar = page.getByRole('button', { name: /Guardar Cambios/i });
    await expect(guardar).toBeEnabled();
    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/v1\/catalog\/productos\/[^/]+$/.test(r.url()) && r.request().method() === 'PATCH',
        { timeout: 20_000 },
      ),
      guardar.click(),
    ]);
    expect([200, 201]).toContain(resp.status());
  });

  test('activar/desactivar un bien cambia su estado en el backend (camino feliz)', async ({ page }) => {
    await page.goto('/app/inventario/bienes');

    const toggle = page.locator('button[title="Desactivar"], button[title="Activar"]').first();
    await expect(toggle).toBeVisible();

    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/v1\/catalog\/productos\/[^/]+\/(desactivar|activar)$/.test(r.url()) && r.request().method() === 'PATCH',
        { timeout: 20_000 },
      ),
      toggle.click(),
    ]);
    expect([200, 201]).toContain(resp.status());
  });
});
