# Tapuy — Documentación de diseño (handoff a Claude Design)

Marca cerrada (2026-08): **Tapuy** (quechua: _preguntar_). Estos docs fusionan la identidad ya decidida con la estructura funcional real de cada pantalla, para que Claude Design produzca los mockups/rediseños sin re-litigar decisiones.

## Archivos

| Archivo                                                        | Qué contiene                                                                   | Cuándo pasarlo                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| [01-brand.md](./01-brand.md)                                   | Nombre, posicionamiento, principios, voz y microcopy canónico                  | Siempre, junto a cualquier pantalla |
| [02-visual-system.md](./02-visual-system.md)                   | Paleta, reglas de dosificación, tipografía, logo, specs de componentes, tokens | Siempre, junto a cualquier pantalla |
| [screens/01-landing.md](./screens/01-landing.md)               | Brief de rediseño de la landing                                                | Al diseñar esa pantalla             |
| [screens/02-auth.md](./screens/02-auth.md)                     | Login / Signup                                                                 | ídem                                |
| [screens/03-dashboard.md](./screens/03-dashboard.md)           | Dashboard (tabla + filtros)                                                    | ídem                                |
| [screens/04-process-detail.md](./screens/04-process-detail.md) | Detalle + timeline (pantalla escaparate)                                       | ídem                                |
| [screens/05-create-edit.md](./screens/05-create-edit.md)       | Formularios crear/editar                                                       | ídem                                |
| [screens/06-mobile.md](./screens/06-mobile.md)                 | App Expo completa                                                              | ídem                                |

## Cómo usarlos con Claude Design

Para cada pantalla, pasa **tres archivos**: `01-brand.md` + `02-visual-system.md` + el brief de la pantalla. Cada brief define qué estructura funcional se conserva, qué copy exacto va (ya escrito, no inventar), y qué directivas visuales aplican.

Orden recomendado de diseño: **04-process-detail** primero (es el escaparate: screenshot del README y og:image salen de ahí) → 03-dashboard → 05-create-edit → 02-auth → 01-landing → 06-mobile.

Todo se diseña **dark mode primero** y se verifica en light.

## Implementación de referencia (no pasar a Claude Design; para el dev)

En `workspace-temp/hiring-design/` viven los artefactos ya listos para integrar:

- `tapuy-theme.css` — tokens Tailwind 4 (`@theme`), dark default + `.light`. Se importa en `apps/web/src/styles.css`.
- `hiring-process-status.ts` — drop-in de `packages/domain/src/constants/hiring-process-status.ts` con los colores nuevos y el campo `variant` (tinted/solid).
- `README-template.md` — cabecera del repo para el lanzamiento open source.

Los docs fuente de la marca (versión larga) también están ahí: `02-brand-identity.md`, `03-visual-identity.md`.
