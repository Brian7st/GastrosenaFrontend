import { test, expect } from '@playwright/test';

test.describe('Inventario · Presupuesto (registrar contra backend real)', () => {
  test('registrar presupuesto válido lo persiste (camino feliz)', async ({ page }) => {
    await page.goto('/app/inventario/presupuesto/registrar');

    await expect(page.locator('input[formcontrolname="fichaId"]')).toBeVisible();
    await page.locator('input[formcontrolname="fichaId"]').fill(`${Date.now()}`.slice(-7));
    await page.locator('input[formcontrolname="programaFormacion"]').fill('Cocina E2E');
    await page.locator('select[formcontrolname="vigencia"]').selectOption({ index: 1 });
    await page.locator('input[formcontrolname="fechaAprobacion"]').fill('2026-06-09');
    await page.locator('input[formcontrolname="rubroDescripcion"]').fill('Insumos de cocina');
    await page.locator('input[formcontrolname="rubroCodigo"]').fill('RUB-E2E-1');
    await page.locator('input[formcontrolname="rubroPosicionPresupuestal"]').fill('A-02-02');
    await page.locator('input[formcontrolname="rubroDependencia"]').fill('Centro E2E');
    await page.locator('select[formcontrolname="rubroFuente"]').selectOption({ index: 1 });
    const monto = page.locator('input[formcontrolname="montoAsignado"]');
    await monto.fill('5000000');

    await expect(page.getByRole('button', { name: /Guardar Presupuesto/i })).toBeEnabled();

    // Enviar vía ngSubmit (Enter en un campo) — robusto frente a overlays del modal.
    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/v1/budget/presupuestos') && r.request().method() === 'POST',
        { timeout: 20_000 },
      ),
      monto.press('Enter'),
    ]);
    expect([200, 201]).toContain(resp.status());
  });

  test('presupuesto sin campos obligatorios deja Guardar deshabilitado (camino malo)', async ({ page }) => {
    await page.goto('/app/inventario/presupuesto/registrar');
    await expect(page.locator('input[formcontrolname="fichaId"]')).toBeVisible();
    // Sin llenar nada → form inválido
    await expect(page.getByRole('button', { name: /Guardar Presupuesto/i })).toBeDisabled();
  });
});
