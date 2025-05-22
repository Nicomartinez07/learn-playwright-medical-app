import { test, expect } from '@playwright/test';

test('Iniciar Sesion Sin contraseña', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('nicolasmartinezalfonso@gmail.com');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page.getByText('La contraseña es requerida')).toBeVisible();
});