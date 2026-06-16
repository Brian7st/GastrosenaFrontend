import { test, expect } from '@playwright/test';

/**
 * Smoke: con sesión iniciada, el módulo inventario carga y pega contra el backend real.
 */
test('inventario / bienes carga y lista productos del backend', async ({ page }) => {
  // Enganchamos el listener ANTES de navegar para no perder la respuesta (race).
  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/v1/catalog/productos') && r.request().method() === 'GET',
      { timeout: 20_000 },
    ),
    page.goto('/app/inventario/bienes'),
  ]);

  expect(resp.status(), 'el backend de inventario debe responder OK').toBe(200);
  await expect(page).toHaveURL(/inventario\/bienes/);
  await expect(page.locator('body')).toContainText(/bien|stock|inventario/i);
});
