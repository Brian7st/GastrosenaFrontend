import { test, expect } from '@playwright/test';

/**
 * Configuración de umbrales de stock.
 *
 * GAP CONOCIDO: la página llama GET /api/v1/alerts/alertas/umbrales y
 * PUT /api/v1/alerts/alertas/umbrales/{id}, pero el backend NO implementa esos
 * endpoints (el AlertaController solo tiene /alertas, /alertas/{id}, /resolver).
 * Este test DOCUMENTA el gap: la página carga pero su request de umbrales falla (404).
 * Cuando el backend implemente umbrales, este test debe actualizarse a esperar 200.
 */
test('alertas/configuracion: GAP — el endpoint de umbrales no existe en backend (404)', async ({ page }) => {
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/v1/alerts/alertas/umbrales'), {
      timeout: 25_000,
    }),
    page.goto('/app/inventario/alertas/configuracion'),
  ]);

  // Hoy el backend devuelve 404/4xx porque el endpoint no existe.
  expect(
    resp.status(),
    'GAP conocido: umbrales no implementado en backend — cuando exista, cambiar a 200',
  ).toBeGreaterThanOrEqual(400);
});
