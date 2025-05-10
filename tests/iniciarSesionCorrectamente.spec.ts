import { test, expect } from '@playwright/test';

test('Inciar Sesion Credenciales Correctas ok', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.goto('http://localhost:3000/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('example@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345678');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.goto('http://localhost:3000/dashboard');
});