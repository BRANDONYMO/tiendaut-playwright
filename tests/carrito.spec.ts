import { test, expect } from '@playwright/test';

test.describe('Carrito de compras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalogo.html');
  });

  test('muestra los 4 productos del catálogo', async ({ page }) => {
    // La API tarda ~800 ms: toHaveCount reintenta hasta que se cumpla
    await expect(page.getByTestId('producto')).toHaveCount(4);
  });

  test('agregar dos productos actualiza el contador', async ({ page }) => {
    await test.step('Agregar el teclado', async () => {
      await page.getByTestId('producto')
        .filter({ hasText: 'Teclado mecánico' })
        .getByRole('button', { name: 'Agregar al carrito' })
        .click();
    });

    await test.step('Agregar el mouse', async () => {
      await page.getByTestId('producto')
        .filter({ hasText: 'Mouse inalámbrico' })
        .getByRole('button', { name: 'Agregar al carrito' })
        .click();
    });

    await expect(page.getByTestId('contador-carrito')).toHaveText('2');
  });

  test('el buscador filtra los productos', async ({ page }) => {
    const productos = page.getByTestId('producto');
    await expect(productos).toHaveCount(4); // Esperar a que cargue la API antes de escribir
    await page.getByPlaceholder('Buscar producto').fill('monitor');
    await expect(productos).toHaveCount(1);
    await expect(productos.first()).toContainText('Monitor 24 pulgadas');
  });
  test('Vaciar carrito deja el contador en 0 sin errores de JS', async ({ page }) => {
    const errores: string[] = [];
    page.on('pageerror', (err) => errores.push(err.message));

    await page.goto('/catalogo.html');
    
    // Agregamos un producto y verificamos que el contador sea 1
    await page.getByTestId('producto').first().getByRole('button', { name: 'Agregar al carrito' }).click();
    await expect(page.getByTestId('contador-carrito')).toHaveText('1');

    // Vaciamos el carrito
    await page.getByRole('button', { name: 'Vaciar carrito' }).click();
    
    // Verificamos que el contador regrese a 0
    await expect(page.getByTestId('contador-carrito')).toHaveText('0');

    // Comprobamos que no se hayan lanzado excepciones de JavaScript
    expect(errores).toEqual([]);
  });
});
