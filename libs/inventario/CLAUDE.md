# Dominio: inventario

Estás trabajando en el dominio **inventario** de GastroSENA.

## Tus permisos
- Modificar: libs/inventario/**
- Leer: libs/shared/** (solo para importar, nunca modificar)
- Todo lo demás está fuera de tu alcance

## Antes de cualquier cambio
Lee .ai/domains/inventario.md para las reglas específicas de este dominio.
Lee .ai/rules/architecture.md para las reglas de dependencias.
Lee .ai/rules/code-quality.md para los estándares de código.

## Scope de tus commits
feat(inventario): ... | fix(inventario): ... | chore(inventario): ...

## Si necesitás algo de shared
No lo modificás vos — coordiná con el equipo de Arquitectura.

## Estructura de carpetas

```
libs/inventario/inventario/src/lib/
├── pages/                        ← una carpeta por ruta del sidebar
│   ├── bienes-page/              ← listado y gestión de bienes
│   ├── facturas-page/            ← facturas de compra
│   ├── solicitudes-page/         ← solicitudes de bienes
│   ├── consolidado-page/         ← consolidado de inventario
│   ├── kardex-page/              ← tarjeta kardex por bien
│   ├── alertas-page/             ← alertas de stock mínimo
│   ├── presupuesto-page/         ← presupuesto de compras
│   ├── conciliacion-page/        ← conciliación de inventario
│   ├── requisiciones-page/       ← requisiciones internas
│   ├── actas-page/               ← actas de entrega/recepción
│   └── paquete-probatorio-page/  ← paquete probatorio GIL
├── ui/                           ← page raíz del módulo (landing/índice)
├── components/                   ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── inventario.facade.ts      ← único punto de entrada al store
├── models/                       ← interfaces propias del dominio
├── pipes/                        ← pipes específicos de inventario
├── validators/                   ← validadores de formularios del dominio
└── util/                         ← helpers específicos (no van a shared)
```
