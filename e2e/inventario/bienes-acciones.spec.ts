import { test, expect } from '@playwright/test';

/**
 * Acciones sobre un bien existente: editar y activar/desactivar (PATCH al backend real).
 * Operan sobre la primera fila del listado (siempre hay bienes de los tests previos).
 */
test.describe('Inventario · Bienes · acciones de fila', () => {
  test('editar un bien persiste el cambio (camino feliz)', async ({ page }) => {
    await page.goto('/app/inventario/bienes');
    const editar = page.locator('button[title="Editar"]').first();
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

    const desactivar = page.locator('button[title="Desactivar"]').first();
    const activar = page.locator('button[title="Activar"]').first();
    const toggle = (await desactivar.count()) > 0 ? desactivar : activar;
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
