# Dominio: auth

Estás trabajando en el dominio **auth** de GastroSENA.

## Tus permisos
- Modificar: libs/auth/**
- Leer: libs/shared/** (solo para importar, nunca modificar)
- Todo lo demás está fuera de tu alcance

## Antes de cualquier cambio
Lee .ai/domains/auth.md para las reglas específicas de este dominio.
Lee .ai/rules/architecture.md para las reglas de dependencias.
Lee .ai/rules/code-quality.md para los estándares de código.

## Scope de tus commits
feat(auth): ... | fix(auth): ... | chore(auth): ...

## Si necesitás algo de shared
No lo modificás vos — coordiná con el equipo de Arquitectura.

## Estructura de carpetas

```
libs/auth/usuarios/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── lista-page/           ← listado y búsqueda de usuarios
│   ├── roles-page/           ← gestión de roles y permisos
│   └── cuentas-page/         ← administración de cuentas
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── usuarios.facade.ts    ← único punto de entrada al store
├── models/                   ← interfaces propias del dominio
├── pipes/                    ← pipes específicos del dominio
├── validators/               ← validadores de formularios del dominio
└── util/                     ← helpers específicos (no van a shared)
```
