import { test, expect } from '@playwright/test';

test('la API devuelve los 4 productos', async ({ request }) => {
    const respuesta = await request.get('/api/productos');
    expect(respuesta.ok()).toBeTruthy();
    
    const productos = await respuesta.json();
    expect(productos).toHaveLength(4);
    expect(productos[0]).toHaveProperty('precio');
});

test('cada producto de la API tiene nombre y precio mayor a 0', async ({ request }) => {
    const respuesta = await request.get('/api/productos');
    expect(respuesta.ok()).toBeTruthy();
    
    const productos = await respuesta.json();
    
    // Verificamos cada producto de la lista
    for (const producto of productos) {
        expect(producto.nombre).toBeTruthy(); // El nombre no debe estar vacío
        expect(producto.precio).toBeGreaterThan(0); // El precio debe ser mayor a 0
    }
});
