# Dominio: Restaurante

**Equipo propietario:** Equipo Restaurante (3 personas)
**RF relacionados:** RF3.x completo

## Podés modificar
- `libs/restaurante/**`

## Solo lectura
- `libs/shared/**`

## Scope
`feat/restaurante/...` | `fix/restaurante/...`

## Estructura de carpetas

```
libs/restaurante/restaurante/src/lib/
├── pages/                    ← una carpeta por ruta del sidebar
│   ├── mesas-page/
│   ├── pedidos-page/
│   └── caja-page/
├── ui/                       ← page raíz del módulo (landing/índice)
├── components/               ← componentes presentacionales propios del dominio
├── data-access/
│   ├── store/
│   │   ├── actions/
│   │   ├── effects/
│   │   ├── reducers/
│   │   └── selectors/
│   └── restaurante.facade.ts
├── models/
├── pipes/
├── validators/
└── util/
```
