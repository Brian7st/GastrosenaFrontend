import { test, expect } from '@playwright/test';

// Estos tests NO usan la sesión guardada: prueban el login en sí.
test.use({ storageState: { cookies: [], origins: [] } });

test('login con credenciales inválidas muestra error y NO entra (camino malo)', async ({ page }) => {
  await page.goto('/auth/login');

  await page.locator('input[type="email"]').fill('admin@sena.edu.co');
  await page.locator('input[type="password"]').first().fill('clave-incorrecta');
  await page.locator('button[type="submit"]').click();

  // Sigue en login y aparece un mensaje de error; no se guarda token.
  await expect(page).toHaveURL(/\/auth\/login/);
  const token = await page.evaluate(() => localStorage.getItem('auth_token'));
  expect(token, 'no debe guardarse token con credenciales malas').toBeFalsy();
});

test('rutas protegidas redirigen a login sin sesión (camino malo)', async ({ page }) => {
  await page.goto('/app/inventario/bienes');
  await expect(page).toHaveURL(/\/auth\/login/);
});
