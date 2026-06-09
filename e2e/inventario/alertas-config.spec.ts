import { test, expect } from '@playwright/test';

/**
 * Configuración de umbrales de stock (alertas/configuracion).
 * Backend: GET /api/v1/alerts/alertas/umbrales y PUT /api/v1/alerts/alertas/umbrales/{productoId}.
 */
test('alertas/configuracion carga y consulta umbrales del backend (200)', async ({ page }) => {
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/v1/alerts/alertas/umbrales') && r.request().method() === 'GET', {
      timeout: 25_000,
    }),
    page.goto('/app/inventario/alertas/configuracion'),
  ]);

  expect(resp.status(), 'el endpoint de umbrales debe responder 200').toBe(200);
  await expect(page).toHaveURL(/alertas\/configuracion/);
});
