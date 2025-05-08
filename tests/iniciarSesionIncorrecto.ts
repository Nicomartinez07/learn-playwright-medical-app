import { test, expect } from '@playwright/test';

test('Iniciar Sesion Credenciales incorrectas', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('aaaaaaa@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('1233333');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
});