# Dominio: reportes

Estás trabajando en el dominio **reportes** de GastroSENA.

## Tus permisos
- Modificar: libs/reportes/**
- Leer: libs/shared/** (solo para importar, nunca modificar)
- Todo lo demás está fuera de tu alcance

## Antes de cualquier cambio
Lee .ai/domains/reportes.md para las reglas específicas de este dominio.
Lee .ai/rules/architecture.md para las reglas de dependencias.
Lee .ai/rules/code-quality.md para los estándares de código.

## Scope de tus commits
feat(reportes): ... | fix(reportes): ... | chore(reportes): ...

## Si necesitás algo de shared
No lo modificás vos — coordiná con el equipo de Arquitectura.

## Estructura de carpetas

```
libs/reportes/reportes/src/lib/
├── pages/                           ← una carpeta por ruta del sidebar
│   ├── ventas-page/                 ← reportes de ventas
│   └── inventario-reportes-page/   ← reportes de inventario
├── ui/                             ← page raíz del módulo (landing/índice)
├── components/                     ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── reportes.facade.ts          ← único punto de entrada al store
├── models/                         ← interfaces propias del dominio
├── pipes/                          ← pipes específicos del dominio
├── validators/                     ← validadores de formularios del dominio
└── util/                           ← helpers específicos (no van a shared)
```
