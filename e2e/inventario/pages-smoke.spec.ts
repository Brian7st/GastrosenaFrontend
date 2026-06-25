import { test, expect } from '@playwright/test';

/**
 * Smoke de TODAS las páginas del módulo inventario: con sesión iniciada,
 * cada página debe cargar y pegar contra su endpoint real del backend.
 * Cubre el "todo carga" del dominio y caza páginas que llaman endpoints inexistentes.
 */

interface PaginaInventario {
  nombre: string;
  ruta: string;
  apiGet: RegExp; // endpoint principal que la página consulta al cargar
}

const PAGINAS: PaginaInventario[] = [
  { nombre: 'Bienes',                ruta: 'bienes',                  apiGet: /\/api\/v1\/catalog\/productos/ },
  { nombre: 'Solicitudes GIL',       ruta: 'solicitudes-gil',         apiGet: /\/api\/v1\/procurement\/giles/ },
  { nombre: 'Solicitudes de insumos',ruta: 'solicitudes-insumos-page',apiGet: /\/api\/v1\/training\/solicitudes/ },
  { nombre: 'Facturas',              ruta: 'facturas',                apiGet: /\/api\/v1\/sourcing\/facturas/ },
  { nombre: 'Consolidado',           ruta: 'consolidado',             apiGet: /\/api\/v1\/budget\/consolidados/ },
  { nombre: 'Conciliación',          ruta: 'conciliacion',            apiGet: /\/api\/v1\/reconciliation\/conciliaciones/ },
  { nombre: 'Movimientos',           ruta: 'movimientos',             apiGet: /\/api\/v1\/inventory\/movimientos/ },
  { nombre: 'Alertas',               ruta: 'alertas',                 apiGet: /\/api\/v1\/alerts\/alertas/ },
  { nombre: 'Presupuesto',           ruta: 'presupuesto',             apiGet: /\/api\/v1\/budget\/presupuestos/ },
  { nombre: 'Actas',                 ruta: 'actas',                   apiGet: /\/api\/v1\/legalization\/actas/ },
  { nombre: 'Paquete probatorio',    ruta: 'paquete-probatorio',      apiGet: /\/api\/v1\/legalization\/paquetes/ },
];

for (const pagina of PAGINAS) {
  test(`carga "${pagina.nombre}" y consulta el backend (200)`, async ({ page }) => {
    const [resp] = await Promise.all([
      page.waitForResponse((r) => pagina.apiGet.test(r.url()) && r.request().method() === 'GET', {
        timeout: 25_000,
      }),
      page.goto(`/app/inventario/${pagina.ruta}`),
    ]);

    await expect(page, `debe quedar en la ruta ${pagina.ruta}`).toHaveURL(new RegExp(pagina.ruta));
    expect(resp.status(), `${pagina.nombre}: el backend debe responder 2xx`).toBeLessThan(300);
  });
}
