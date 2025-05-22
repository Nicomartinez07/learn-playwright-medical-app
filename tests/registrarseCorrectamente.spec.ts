import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Registrarse' }).click();
  await page.getByRole('textbox', { name: 'Nombre completo' }).click();
  await page.getByRole('textbox', { name: 'Nombre completo' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Nombre completo' }).fill('NICO MARTINEZ');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Email' }).fill('nicolasmartinezalfonso@gmail.com');
  await page.getByRole('textbox', { name: 'Teléfono' }).click();
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Contraseña', exact: true }).click();
  await page.getByRole('textbox', { name: 'Contraseña', exact: true }).fill('1234567890');
  await page.getByRole('textbox', { name: 'Confirmar contraseña' }).click();
  await page.getByRole('textbox', { name: 'Confirmar contraseña' }).fill('1234567890');
  await page.getByRole('button', { name: 'Registrarse' }).click();
  await expect(page.getByRole('main')).toContainText('Iniciar sesiónIngresa tus credenciales para continuarEmailContraseñaIniciar sesión¿No tienes una cuenta? Registrarse');
});