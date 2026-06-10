import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/admin.json';

/**
 * Camino feliz de login (y además deja la sesión guardada para el resto de tests).
 * Credenciales reales del admin contra el micro de usuarios (:8087).
 */
setup('login admin (camino feliz)', async ({ page }) => {
  await page.goto('/auth/login');

  await page.locator('input[type="email"]').fill('admin@sena.edu.co');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.locator('button[type="submit"]').click();

  // Tras login el guard nos lleva a /app/...
  await page.waitForURL(/\/app(\/|$)/, { timeout: 20_000 });

  const token = await page.evaluate(() => localStorage.getItem('auth_token'));
  expect(token, 'el token debe quedar guardado tras el login').toBeTruthy();

  await page.context().storageState({ path: authFile });
});
