import { test, expect } from '@playwright/test';

test.describe('Inventario · Bienes (CRUD contra backend real)', () => {
  test('crear bien válido lo persiste en el backend (camino feliz)', async ({ page }) => {
    await page.goto('/app/inventario/bienes');
    const nuevo = page.getByRole('button', { name: /Nuevo Bien/i });
    await expect(nuevo).toBeVisible();
    await nuevo.click();

    const codigo = `E2E-${Date.now()}`;
    await page.locator('input[formcontrolname="codigoSena"]').fill(codigo);
    await page.locator('input[formcontrolname="descripcion"]').fill('Bien creado por E2E Playwright');
    await page.locator('select[formcontrolname="categoria"]').selectOption({ index: 1 });
    await page.locator('select[formcontrolname="unidadMedida"]').selectOption('UND');
    await page.locator('input[formcontrolname="stockMinimo"]').fill('5');
    await page.locator('input[formcontrolname="vrlAdjudicado"]').fill('1000');
    await page.locator('input[formcontrolname="iva"]').fill('19');

    const guardar = page.getByRole('button', { name: /Guardar Bien/i });
    await expect(guardar).toBeEnabled();

    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/v1/catalog/productos') && r.request().method() === 'POST',
        { timeout: 20_000 },
      ),
      guardar.click(),
    ]);
    expect([200, 201]).toContain(resp.status());
  });

  test('formulario inválido deja el botón Guardar deshabilitado (camino malo)', async ({ page }) => {
    await page.goto('/app/inventario/bienes');
    const nuevo = page.getByRole('button', { name: /Nuevo Bien/i });
    await expect(nuevo).toBeVisible();
    await nuevo.click();

    // descripción demasiado corta (<3) y sin categoría/UM => form inválido
    await page.locator('input[formcontrolname="descripcion"]').fill('ab');

    await expect(page.getByRole('button', { name: /Guardar Bien/i })).toBeDisabled();
  });
});
