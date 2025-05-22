import { test, expect } from '@playwright/test';

test('Iniciar sesion incorrecto', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Registrarse' }).click();
  await page.getByRole('textbox', { name: 'Nombre completo' }).click();
  await page.getByRole('textbox', { name: 'Nombre completo' }).fill('a');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('.@a.com');
  await page.getByRole('textbox', { name: 'Teléfono' }).click();
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('0000');
  await page.getByRole('textbox', { name: 'Contraseña', exact: true }).click();
  await page.getByRole('textbox', { name: 'Contraseña', exact: true }).fill('1234');
  await page.getByRole('textbox', { name: 'Confirmar contraseña' }).click();
  await page.getByRole('textbox', { name: 'Confirmar contraseña' }).fill('1233');
  await page.getByRole('button', { name: 'Registrarse' }).click();
  await expect(page.getByText('El nombre debe tener al menos')).toBeVisible();
  await expect(page.getByText('Ingrese un email válido')).toBeVisible();
  await expect(page.getByText('Ingrese un número de teléfono')).toBeVisible();
  await expect(page.getByText('La contraseña debe tener al')).toBeVisible();
  await expect(page.getByText('El nombre debe tener al menos')).toBeVisible();
  await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible();
});