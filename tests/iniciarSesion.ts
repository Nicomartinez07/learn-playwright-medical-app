import { test, expect } from '@playwright/test';

test('Inciar Sesion Usuario existente', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.goto('http://localhost:3000/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('nicolasmartinezalfonso@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('nicolas07');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.goto('http://localhost:3000/dashboard');
});