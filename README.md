# GastroSENA Frontend

Monorepo Angular 20 + Nx para el sistema de gestión del restaurante SENA (23 desarrolladores, 13 dominios de negocio).

## Documentación

| Documento | Descripción |
|---|---|
| [Setup y desarrollo](docs/setup.md) | Cómo instalar, correr y crear features |
| [Arquitectura](docs/arquitectura.md) | Estructura, reglas de dependencia, Git workflow, design tokens |
| [Requisitos funcionales](docs/requisitos.md) | RFs por módulo con roles y prioridades |

## Gobernanza de IA

| Archivo | Herramienta |
|---|---|
| `CLAUDE.md` | Claude Code |
| `.cursorrules` | Cursor |
| `AGENTS.md` | Antigravity y otros agentes |
| `.ai/protocol.md` | Protocolo obligatorio antes de cualquier cambio |
| `.ai/domains/{dominio}.md` | Reglas y permisos por dominio de negocio |

## Stack

- **Angular 20** — standalone components, signals, OnPush
- **Nx 20** — monorepo, module boundaries, affected commands
- **NgRx 20** — store, effects, facades
- **TypeScript strict** — sin `any`, sin non-null assertions innecesarios
- **SCSS** — design tokens en `libs/shared/ui/src/lib/tokens/_variables.scss`

## Inicio rápido

```bash
npm install
npm start          # http://localhost:4200
npm test           # tests afectados
npm run lint       # lint afectado
```
