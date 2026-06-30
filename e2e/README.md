# E2E full-stack — módulo Inventario (Playwright)

Tests end-to-end que manejan la **UI real** (Angular) contra los **microservicios reales** en Docker.
Cubren formularios, importación desde Excel, y todas las páginas del dominio inventario,
en **camino feliz** y **camino malo**.

## Requisitos (todo corriendo en local)

| Servicio | Puerto | Cómo |
|----------|--------|------|
| Backend inventario | `:8081` | `docker compose up -d` en `ga-ms-inventario-1.1` |
| Microservicio usuarios (login) | `:8087` | su propio Docker |
| Frontend (dev server + proxy) | `:4200` | `npm start` (nx serve restaurant-app) |

Credenciales de prueba (admin): `admin@sena.edu.co` / `admin123`.

## Correr

```bash
npm run e2e            # toda la suite (headless)
npm run e2e:ui         # modo interactivo
npm run e2e:report     # ver el último reporte HTML
npx playwright test e2e/inventario/bienes.spec.ts   # un archivo
```

## Estructura

```
e2e/
├── auth.setup.ts            ← login real (camino feliz) + guarda la sesión para el resto
├── auth/login.spec.ts       ← login inválido + rutas protegidas (camino malo)
└── inventario/
    ├── smoke.spec.ts            ← bienes carga + pega al backend
    ├── pages-smoke.spec.ts      ← las 11 páginas cargan y consultan su endpoint (2xx)
    ├── bienes.spec.ts           ← crear bien (feliz) + validación (malo)
    ├── bienes-import.spec.ts    ← importar .xlsx (feliz) + rechazo sin codigoSena (malo)
    ├── presupuesto.spec.ts      ← registrar presupuesto (feliz) + validación (malo)
    └── alertas-config.spec.ts   ← documenta el GAP: umbrales no existe en backend (404)
```

## Notas

- La sesión se obtiene UNA vez (`auth.setup.ts`) y se reusa via `storageState` (más rápido y estable).
- Para formularios en modal, enviar con `Enter` en un campo (ngSubmit) evita problemas de overlay.
- La cadena de negocio completa (solicitud → GIL → factura → conciliación → acta → paquete) está
  cubierta por el E2E de API del backend (`ga-ms-inventario-1.1/seed/e2e_full.sh`, 62/0). Acá el foco
  es la UI a nivel de página + los CRUD/import autocontenidos.
- **GAP abierto**: `alertas/configuracion` llama endpoints de umbrales que el backend aún no tiene.
