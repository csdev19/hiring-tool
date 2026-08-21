# Design Handoff — Hiring Tool

Documentación de todas las pantallas de la app, pensada para pasarle contexto a Claude Design (o a cualquier diseñador) y construir una identidad visual y un sistema de diseño.

## Contenido

| Archivo                                                        | Qué contiene                                                          |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| [00-product-overview.md](./00-product-overview.md)             | Qué es el producto, para quién, modelo de datos y flujos principales  |
| [01-brand-brief.md](./01-brand-brief.md)                       | Insumos para pensar nombre de marca, filosofía, tono y personalidad   |
| [02-design-system-current.md](./02-design-system-current.md)   | Estado actual del UI: componentes, colores, patrones, y qué falta     |
| [screens/01-landing.md](./screens/01-landing.md)               | Landing page pública                                                  |
| [screens/02-auth.md](./screens/02-auth.md)                     | Login y Signup                                                        |
| [screens/03-dashboard.md](./screens/03-dashboard.md)           | Dashboard / lista de procesos (pantalla principal)                    |
| [screens/04-process-detail.md](./screens/04-process-detail.md) | Detalle de un proceso + timeline de interacciones (pantalla más rica) |
| [screens/05-create-edit.md](./screens/05-create-edit.md)       | Formularios de crear y editar proceso                                 |
| [screens/06-mobile.md](./screens/06-mobile.md)                 | App móvil (Expo): lista, stats, detalle, crear, perfil, auth          |

## Cómo usar esto con Claude Design

1. Pasa primero `00-product-overview.md` y `01-brand-brief.md` para definir nombre, filosofía y dirección visual.
2. Con la dirección definida, pasa `02-design-system-current.md` para generar tokens (paleta, tipografía, radios, sombras) que reemplacen los defaults actuales.
3. Pasa los archivos de `screens/` uno por uno para rediseñar cada pantalla respetando su estructura funcional (lo que se documenta aquí es _qué hace y qué muestra_ cada pantalla; el layout puede cambiar).
