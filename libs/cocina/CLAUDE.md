# Dominio: cocina

Estás trabajando en el dominio **cocina** de GastroSENA.

## Tus permisos
- Modificar: libs/cocina/**
- Leer: libs/shared/** (solo para importar, nunca modificar)
- Todo lo demás está fuera de tu alcance

## Antes de cualquier cambio
Lee .ai/domains/cocina.md para las reglas específicas de este dominio.
Lee .ai/rules/architecture.md para las reglas de dependencias.
Lee .ai/rules/code-quality.md para los estándares de código.

## Scope de tus commits
feat(cocina): ... | fix(cocina): ... | chore(cocina): ...

## Si necesitás algo de shared
No lo modificás vos — coordiná con el equipo de Arquitectura.

## Estructura de carpetas

```
libs/cocina/cocina/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── comandas-page/        ← gestión de comandas de cocina
│   ├── recetas-page/         ← recetas y preparaciones
│   └── menu-page/            ← menú del día y carta
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── cocina.facade.ts      ← único punto de entrada al store
├── models/                   ← interfaces propias del dominio
├── pipes/                    ← pipes específicos de cocina
├── validators/               ← validadores de formularios del dominio
└── util/                     ← helpers específicos (no van a shared)
```
