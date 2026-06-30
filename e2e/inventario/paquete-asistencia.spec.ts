import { test, expect, Page } from '@playwright/test';

/**
 * E2E del flujo "Llamado de asistencia" del paquete probatorio, contra el
 * backend real (inventario :8081 + usuarios :8087, vía gateway/proxy).
 *
 * Precondiciones de datos (sembradas en la DB de usuarios para el dev stack):
 *  - Ficha 2589632 (Técnico en Cocina) con aprendices activos vinculados.
 *  - Paquetes en estado INCOMPLETO sin asistencia registrada.
 * El test de guardado CONSUME un paquete (lo deja con asistencia adjunta);
 * si se agotan los paquetes frescos, re-sembrar antes de re-correr.
 */

const FICHA_COCINA = '2589632';
const APRENDIZ = 'Ana Bernal Rios';

/** Abre el primer paquete del listado y entra a su vista de asistencia. */
async function abrirAsistenciaDelPrimerPaquete(page: Page): Promise<void> {
  await page.goto('/app/inventario/paquete-probatorio');
  const primeraFila = page.locator('tr.paquete-table__row').first();
  await expect(primeraFila).toBeVisible();
  await primeraFila.click();

  await expect(page).toHaveURL(/\/paquete-probatorio\/[0-9a-f-]+$/);
  await page.getByRole('button', { name: /Tomar asistencia/i }).click();

  await expect(page).toHaveURL(/\/asistencia$/);
  await expect(page.getByRole('heading', { name: /Llamado de asistencia/i })).toBeVisible();
}

/** Selecciona la ficha de Cocina y espera a que carguen sus aprendices reales. */
async function cargarAprendicesDeCocina(page: Page): Promise<void> {
  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => /\/api\/fichas\/[^/]+\/aprendices/.test(r.url()) && r.request().method() === 'GET',
      { timeout: 20_000 },
    ),
    page.locator('.context-card__select').selectOption(FICHA_COCINA),
  ]);
  expect(resp.status()).toBe(200);
  await expect(page.getByText(APRENDIZ)).toBeVisible();
}

test.describe('Inventario · Llamado de asistencia (contra backend real)', () => {
  test('carga aprendices reales de la ficha y permite marcar estados (camino feliz)', async ({ page }) => {
    await abrirAsistenciaDelPrimerPaquete(page);
    await cargarAprendicesDeCocina(page);

    const fila = page.getByRole('row', { name: new RegExp(APRENDIZ) });
    await expect(fila).toBeVisible();

    // Marcar "Tarde" en ese aprendiz deja el botón activo.
    await fila.getByTitle('Tarde').click();
    await expect(fila.getByTitle('Tarde')).toHaveClass(/--active/);

    // "Marcar todos: asistió" reactiva el estado de la fila.
    await page.getByRole('button', { name: /Marcar todos: asistió/i }).click();
    await expect(fila.getByTitle('Asistió')).toHaveClass(/--active/);
  });

  test('guarda la asistencia y registra el llamado en el paquete (camino feliz)', async ({ page }) => {
    await abrirAsistenciaDelPrimerPaquete(page);
    await cargarAprendicesDeCocina(page);

    // Solo corre el guardado sobre un paquete aún sin asistencia.
    const badge = page.locator('restaurant-status-badge').first();
    test.skip(
      (await badge.textContent())?.includes('registrada') ?? false,
      'El paquete ya tiene asistencia registrada; se omite el guardado.',
    );

    const fila = page.getByRole('row', { name: new RegExp(APRENDIZ) });
    await fila.getByTitle('Tarde').click();

    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => /\/api\/v1\/legalization\/paquetes\/[^/]+\/asistencia$/.test(r.url())
          && r.request().method() === 'POST',
        { timeout: 20_000 },
      ),
      page.getByRole('button', { name: /Guardar asistencia/i }).click(),
    ]);
    expect(resp.status()).toBe(201);

    // El badge pasa a "Asistencia registrada".
    await expect(badge).toContainText(/registrada/i);
  });
});
