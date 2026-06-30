# Dominio: bar

Estás trabajando en el dominio **bar** de GastroSENA.

## Tus permisos
- Modificar: libs/bar/**
- Leer: libs/shared/** (solo para importar, nunca modificar)
- Todo lo demás está fuera de tu alcance

## Antes de cualquier cambio
Lee .ai/domains/bar.md para las reglas específicas de este dominio.
Lee .ai/rules/architecture.md para las reglas de dependencias.
Lee .ai/rules/code-quality.md para los estándares de código.

## Scope de tus commits
feat(bar): ... | fix(bar): ... | chore(bar): ...

## Si necesitás algo de shared
No lo modificás vos — coordiná con el equipo de Arquitectura.

## Estructura de carpetas

```
libs/bar/bar/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── comandas-page/        ← gestión de comandas del bar
│   ├── recetas-page/         ← recetas de bebidas
│   └── menu-page/            ← carta de bebidas
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── bar.facade.ts         ← único punto de entrada al store
├── models/                   ← interfaces propias del dominio
├── pipes/                    ← pipes específicos del bar
├── validators/               ← validadores de formularios del dominio
└── util/                     ← helpers específicos (no van a shared)
```
