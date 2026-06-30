# Dominio: Auth + Usuarios

**Equipo propietario:** Equipo Auth (2 personas)
**RF relacionados:** RF1.2–1.4, RF2.x

## Podés modificar
- `libs/auth/**`

## Solo lectura
- `libs/shared/**`

## Nunca tocás
- `libs/shared/auth/` — ese es del equipo de Arquitectura, coordiná con ellos

## Scope
`feat/auth/...` | `fix/auth/...` | `feat/usuarios/...`

## Estructura de carpetas

```
libs/auth/usuarios/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── lista-page/
│   ├── roles-page/
│   └── cuentas-page/
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── usuarios.facade.ts
├── models/
├── pipes/
├── validators/
└── util/
```
