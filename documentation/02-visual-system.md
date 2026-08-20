# Tapuy — Sistema visual (para sesiones de diseño)

Dirección cerrada: **"Cumbia amazónica" — tinta neón sobre base casi negra.** El 90% de cada pantalla son neutros azulados; el 9% los 8 colores de estado; el 1% los neones. Dark mode es el default y el escaparate; light existe y es correcto, pero la marca se presenta en dark. Tokens implementados en `workspace-temp/hiring-design/tapuy-theme.css`.

## 1. Paleta

### Neones (el 1%)

| Color | Dark | Light | Rol | Dónde aparece |
| --- | --- | --- | --- | --- |
| **Menta** | `#00FFC2` | `#00A67E` | Acento del producto | Botón primario, focus ring, links, selección, punto del logo, tab activo |
| **Fucsia** | `#FF00A0` | `#C2007A` | El momento | **Solo** el estado `offer-made` (y el nodo `offer` del timeline). Nada más es fucsia. |
| **Violeta** | `#7A00FF` | `#5B00C4` | Textura de marca | Landing, README, og:image, estado `first-contact`. Casi invisible dentro de la app. |

Texto sobre neón: el tono oscuro de su propia familia (menta→`#04261D`, fucsia→`#3A0022`, violeta→`#E8D6FF`). Nunca negro ni blanco puros.

### Neutros (el 90%, tinte azul frío)

| Token | Dark | Light | Uso |
| --- | --- | --- | --- |
| `bg` | `#0A0F14` | `#F3F5F8` | Página |
| `surface` | `#0F161D` | `#FFFFFF` | Cards, sidebar, form sticky |
| `surface-2` | `#141C25` | `#E9EDF2` | Inputs, hover de fila, popovers |
| `selected` | `#0F1A1A` | `#E4FAF3` | Fila/ítem seleccionado |
| `border` | `#1C232B` | `#D5DAE1` | Hairlines |
| `border-strong` | `#2A3440` | `#B8C0CB` | Divisores, hover de input, botón secondary |
| `text` | `#E6EBF0` | `#0F1720` | Cuerpo |
| `text-secondary` | `#A7B1BC` | `#4A5563` | Apoyo (puesto, fechas) |
| `text-muted` | `#6B7785` | `#7A8593` | Placeholders, headers de tabla, metadata |

Nunca `#000`/`#FFF` como fondo de página; nunca grises cálidos.

### Los 8 estados (el 9%)

Regla estructural: **activos = badge tintado con borde** (fondo ~12%, texto ~80%, borde ~40%); **terminales = badge sólido**. La categoría se lee por forma antes que por color.

| Estado | Cat. | Dark bg/text/border | Light bg/text/border |
| --- | --- | --- | --- |
| `first-contact` | activo | `#1B0F33` / `#C9A6FF` / `#4A1F8A` | `#EFE4FF` / `#4A1F8A` / `#C9A6FF` |
| `ongoing` | activo | `#0E1F38` / `#8FC1F5` / `#1F4B82` | `#E3EEFB` / `#1F4B82` / `#9FC7F0` |
| `on-hold` | activo | `#2A1E08` / `#F0C061` / `#7A5A18` | `#FBF0D5` / `#7A5A18` / `#EDCF7A` |
| `offer-made` | activo | `#2E0A22` / `#FF6BC6` / `#8A0A5A` | `#FFE3F3` / `#8A0A5A` / `#FF8DD4` |
| `offer-accepted` | terminal | `#2FA155` / `#04200D` | `#1E8C44` / `#F0FAF3` |
| `hired` | terminal | `#1E7A3E` / `#E6F7EC` | `#156B34` / `#EAF6EE` |
| `rejected` | terminal | `#C73A3A` / `#FDECEC` | `#B52F2F` / `#FDECEC` |
| `dropped-out` | terminal | `#4A5562` / `#EEF2F5` | `#5A6470` / `#F4F6F8` |

- Los verdes de `offer-accepted`/`hired` son **verde hoja**, no menta: la menta es acción, el verde es resultado.
- `rejected` es rojo franco pero no neón (no compite con el fucsia de la oferta).
- No hay paleta semántica aparte: success reutiliza `hired`, warning `on-hold`, info `ongoing`. Danger propio: `#E05252` dark / `#C73A3A` light.

## 2. Reglas de dosificación (no negociables)

1. **90/9/1** — medible: en un screenshot del dashboard, la menta aparece en ≤3 puntos.
2. **Un botón primario por vista.** El resto secondary (borde `border-strong`, fondo transparente) o ghost.
3. **Neón nunca como fondo de un área mayor que un botón** (ni headers, ni cards, ni banners).
4. **Neón como texto solo ≤14px.**
5. **Los neones no conviven en la misma superficie.** Excepción única: logo, og:image y hero de landing.
6. **Sin gradientes, sin glow, sin sombras de color.** El neón es plano; el brillo lo da el contraste.
7. **Dark primero**; cada componente se verifica en light después.

## 3. Tipografía

| Uso | Fuente | Detalle |
| --- | --- | --- |
| UI (web + móvil) | **Geist** | Pesos 400 y 500 únicamente. 600/700 nunca. |
| Números (salarios, fechas, IDs, contadores) | **Geist Mono** | `tabular-nums`. Es "Numbers, not vibes" hecho tipografía. |
| Display (landing, README hero, og:image) | **Instrument Serif** | Solo titulares. Nunca dentro de la app. |

Escala UI: 12 metadata · 13 tabla y badges · 14 cuerpo · 16 prosa Markdown del timeline · 20 h3 · 24 h2 · 32 h1 de página. Landing libre. Markdown del timeline: 16px / line-height 1.7 — la única zona con aire.

## 4. Logo

Signo de interrogación reducido a su gesto mínimo: **un arco abierto + un punto**. El punto siempre menta (incluso en light: `#00A67E`); el arco en `text`. Variantes: símbolo solo (favicon, app icon sobre `#0A0F14` al 60% del canvas, avatar GitHub), lockup horizontal (símbolo + "tapuy" en Geist 500 minúsculas, tracking −0.01em) para el header web, lockup landing (+ tagline en Instrument Serif). Sin versiones fucsia/violeta del símbolo.

## 5. Specs de componentes clave

- **Badge de estado:** 11–12px peso 500, padding 2×8, radio 5px. Activos con borde 1px; terminales sin borde. **Nunca ícono ni emoji dentro del badge.**
- **Tabla dashboard:** filas 40px, hairline entre filas, header `text-muted` 11px, salario a la derecha en Geist Mono. Hover `surface-2`, seleccionada `selected`. Sin zebra.
- **Timeline:** línea vertical `border-strong`, nodo 8px en `text-muted`; nodo de `offer` en fucsia, nodo de `rejection` en rojo `rejected`. Card sobre `surface`, título 14/500, fecha Geist Mono `text-muted`, contenido Markdown 16/1.7.
- **Botón primario:** fondo menta, texto `#04261D`, peso 500, radio 6px, alto 36px, hover `#33FFD0`.
- **Focus ring:** `0 0 0 2px bg, 0 0 0 4px menta` — el único lugar donde la menta aparece "gratis".
- **Toast:** `surface-2` + borde `border`, sin fondo de color; el color va en un punto de 6px a la izquierda.
- **Radios:** control 6px · badge 5px · card 12px.

## 6. Qué no hacer

- Neón como relleno de barras/gráficos (usar colores de estado tintados).
- Violeta dentro de la app fuera de `first-contact`.
- Gradiente menta→violeta.
- Badges con emoji o ícono.
- Confeti o celebración al marcar `hired` — el verde sólido ya lo dice.
