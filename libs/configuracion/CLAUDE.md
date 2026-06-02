# Dominio: configuracion

Estás trabajando en el dominio **configuracion** de GastroSENA.

## Tus permisos
- Modificar: libs/configuracion/**
- Leer: libs/shared/** (solo para importar, nunca modificar)
- Todo lo demás está fuera de tu alcance

## Antes de cualquier cambio
Lee .ai/domains/configuracion.md para las reglas específicas de este dominio.
Lee .ai/rules/architecture.md para las reglas de dependencias.
Lee .ai/rules/code-quality.md para los estándares de código.

## Scope de tus commits
feat(configuracion): ... | fix(configuracion): ... | chore(configuracion): ...

## Estructura de carpetas

```
libs/configuracion/configuracion/src/lib/
├── pages/
│   ├── config-page/
│   └── bien-delete-page/
├── components/
│   └── config-section/
├── data-access/
│   ├── configuracion.facade.ts
│   └── configuracion.service.ts
├── models/
│   └── configuracion.model.ts
└── util/
    └── index.ts
```
