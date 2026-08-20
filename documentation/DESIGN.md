# Tapuy — Design system

Referencia visual canónica. Dirección cerrada en 2026-08: **"cumbia amazónica" — tinta neón sobre base casi negra.**
Tokens implementados en [`tapuy-theme.css`](./tapuy-theme.css). Producto, copy y specs de pantalla en [`TAPUY.md`](./TAPUY.md).

Dark mode es el default y el escaparate; light existe y es correcto, pero la marca se presenta en dark.

---

## 1. Dosificación — 90 / 9 / 1

| Proporción | Qué | Rol |
| --- | --- | --- |
| **90%** | Neutros azulados | Toda la superficie: página, cards, inputs, texto |
| **9%** | Los 8 colores de estado | Badges, nodos del timeline |
| **1%** | Los 3 neones | Acento, momento, textura de marca |

Reglas no negociables:

1. Medible: en un screenshot del dashboard la **menta aparece en ≤3 puntos**.
2. **Un solo botón primario por vista.** El resto secondary (`border-strong`, fondo transparente) o ghost.
3. Neón **nunca** como fondo de un área mayor que un botón — ni headers, ni cards, ni banners.
4. Neón como texto **solo ≤14px**.
5. Los neones **no conviven en la misma superficie**. Excepción única: logo, og:image y hero de landing.
6. **Sin gradientes, sin glow, sin sombras de color.** El neón es plano; el brillo lo da el contraste.
7. **Dark primero**; cada componente se verifica en light después.

---

## 2. Paleta

### Neones — el 1%

| Color | Token | Dark | Light | Rol | Dónde aparece |
| --- | --- | --- | --- | --- | --- |
| Menta | `--mint` | `#00FFC2` | `#00A67E` | Acento del producto | Botón primario, focus ring, links, selección, punto del logo, tab activo |
| Fucsia | `--fuchsia` | `#FF00A0` | `#C2007A` | El momento | **Solo** `offer-made` y el nodo `offer` del timeline. Nada más es fucsia. |
| Violeta | `--violet` | `#7A00FF` | `#5B00C4` | Textura de marca | Landing, README, og:image, estado `first-contact`. Casi invisible dentro de la app. |

Hover de menta: `#33FFD0` (dark). Texto sobre neón = el tono oscuro de su propia familia — menta `#04261D`, fucsia `#3A0022`, violeta `#E8D6FF`. **Nunca negro ni blanco puros.**

### Neutros — el 90%, tinte azul frío

| Token | Dark | Light | Uso |
| --- | --- | --- | --- |
| `--bg` | `#0A0F14` | `#F3F5F8` | Página |
| `--surface` | `#0F161D` | `#FFFFFF` | Cards, sidebar, form sticky |
| `--surface-2` | `#141C25` | `#E9EDF2` | Inputs, hover de fila, popovers |
| `--selected` | `#0F1A1A` | `#E4FAF3` | Fila/ítem seleccionado |
| `--border` | `#1C232B` | `#D5DAE1` | Hairlines |
| `--border-strong` | `#2A3440` | `#B8C0CB` | Divisores, hover de input, botón secondary |
| `--text` | `#E6EBF0` | `#0F1720` | Cuerpo |
| `--text-secondary` | `#A7B1BC` | `#4A5563` | Apoyo (puesto, fechas) |
| `--text-muted` | `#6B7785` | `#7A8593` | Placeholders, headers de tabla, metadata |

Nunca `#000`/`#FFF` como fondo de página. **Nunca grises cálidos.**

### Los 8 estados — el 9%

Regla estructural: **activos = badge tintado con borde** (fondo ~12%, texto ~80%, borde ~40%); **terminales = badge sólido, sin borde**. La categoría se lee por forma antes que por color.

| Estado | Cat. | Dark bg / text / border | Light bg / text / border |
| --- | --- | --- | --- |
| `first-contact` | activo | `#1B0F33` / `#C9A6FF` / `#4A1F8A` | `#EFE4FF` / `#4A1F8A` / `#C9A6FF` |
| `ongoing` | activo | `#0E1F38` / `#8FC1F5` / `#1F4B82` | `#E3EEFB` / `#1F4B82` / `#9FC7F0` |
| `on-hold` | activo | `#2A1E08` / `#F0C061` / `#7A5A18` | `#FBF0D5` / `#7A5A18` / `#EDCF7A` |
| `offer-made` | activo | `#2E0A22` / `#FF6BC6` / `#8A0A5A` | `#FFE3F3` / `#8A0A5A` / `#FF8DD4` |
| `offer-accepted` | terminal | `#2FA155` / `#04200D` | `#1E8C44` / `#F0FAF3` |
| `hired` | terminal | `#1E7A3E` / `#E6F7EC` | `#156B34` / `#EAF6EE` |
| `rejected` | terminal | `#C73A3A` / `#FDECEC` | `#B52F2F` / `#FDECEC` |
| `dropped-out` | terminal | `#4A5562` / `#EEF2F5` | `#5A6470` / `#F4F6F8` |

- Los verdes de `offer-accepted`/`hired` son **verde hoja, no menta**: la menta es acción, el verde es resultado.
- `rejected` es rojo franco pero **no neón** — no compite con el fucsia de la oferta.
- **No hay paleta semántica aparte:** success reutiliza `hired`, warning `on-hold`, info `ongoing`. Danger propio: `#E05252` dark / `#C73A3A` light.

---

## 3. Tipografía

| Uso | Fuente | Detalle |
| --- | --- | --- |
| UI (web + móvil) | **Geist** | Pesos **400 y 500 únicamente**. 600/700 nunca. |
| Cifras (salarios, fechas, IDs, contadores) | **Geist Mono** | `tabular-nums`. Es "Numbers, not vibes" hecho tipografía. |
| Display (landing, README hero, og:image) | **Instrument Serif** | Solo titulares. **Nunca dentro de la app.** |

Escala UI: **12** metadata · **13** tabla y badges · **14** cuerpo · **16** prosa Markdown del timeline · **20** h3 · **24** h2 · **32** h1 de página. Landing libre.
Markdown del timeline: 16px / line-height **1.7** — la única zona con aire.

---

## 4. Logo

Signo de interrogación reducido a su gesto mínimo: **un arco abierto + un punto.** El punto siempre menta (también en light, `#00A67E`); el arco en `--text`.

Variantes:
- **Símbolo solo** — favicon, app icon (sobre `#0A0F14`, al 60% del canvas), avatar de GitHub.
- **Lockup horizontal** — símbolo + "tapuy" en Geist 500 minúsculas, tracking −0.01em. Header web.
- **Lockup landing** — lockup + tagline en Instrument Serif.

Sin versiones fucsia/violeta del símbolo.

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M7 9a5 5 0 1 1 5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="12" cy="20" r="2" fill="var(--mint)"/>
</svg>
```

---

## 5. Componentes

Radios: **control 6px · badge 5px · card 12px.** Alturas: **control 36px · fila de tabla 40px.**

| Componente | Spec |
| --- | --- |
| **Botón primario** | Fondo menta, texto `#04261D`, peso 500, radio 6px, alto 36px, hover `#33FFD0`. Uno por vista. |
| **Botón secondary** | Fondo transparente, borde 1px `border-strong`, texto `text`, hover fondo `surface-2`. |
| **Botón ghost** | Sin fondo ni borde, texto `text-secondary`, hover fondo `surface-2` + texto `text`. |
| **Input** | Fondo `surface-2`, borde `border`, radio 6px, alto 36px, hover borde `border-strong`, placeholder `text-muted`. Error: borde `danger` + mensaje 13px en `danger`. |
| **Badge de estado** | 11–12px peso 500, padding 2×8, radio 5px. Activos con borde 1px; terminales sin borde. **Nunca ícono ni emoji dentro.** Sentence case ("First contact", "On hold"). |
| **Card** | Fondo `surface`, borde 1px `border`, radio 12px. |
| **Tabla** | Filas 40px, hairline `border` entre filas, header `text-muted` 11px, hover `surface-2`, seleccionada `selected`, **sin zebra**. Salario a la derecha en Geist Mono `tabular-nums`; fechas también en mono. |
| **Timeline** | Línea vertical `border-strong`, nodo 8px en `text-muted`; nodo de `offer` en fucsia, nodo de `rejection` en rojo `rejected`. Card sobre `surface`, título 14/500, fecha en Geist Mono `text-muted`, contenido Markdown 16/1.7. |
| **Focus ring** | `0 0 0 2px var(--bg), 0 0 0 4px var(--mint)` — el único lugar donde la menta aparece "gratis". Global vía `:focus-visible`. |
| **Toast** | `surface-2` + borde `border`, **sin fondo de color**; el color va en un punto de 6px a la izquierda. |
| **Diálogo** | Card `surface` + borde `border-strong`, backdrop `rgba(4,8,12,.72)`. Acciones a la derecha: destructiva sólida `rejected` + `Cancel` secondary. |

---

## 6. Qué no hacer

- Neón como relleno de barras o gráficos → usar colores de estado tintados.
- Violeta dentro de la app fuera de `first-contact`.
- Gradiente menta → violeta (ni ningún otro gradiente).
- Badges con emoji o ícono.
- Confeti o celebración al marcar `hired` — el verde sólido ya lo dice.
- Sombras de color, glow, bordes luminosos.
- Instrument Serif dentro de la app.
- Pesos 600/700 de Geist.

---

## 7. Checklist de revisión

Antes de mergear cualquier vista:

- [ ] ¿Un solo botón primario?
- [ ] ¿La menta aparece en ≤3 puntos?
- [ ] ¿Los badges tienen la forma correcta según categoría (activo con borde / terminal sólido)?
- [ ] ¿Todas las cifras en Geist Mono con `tabular-nums`?
- [ ] ¿Cero gradientes, glow y sombras de color?
- [ ] ¿Copy en sentence case, sin exclamaciones ni palabras prohibidas?
- [ ] ¿Verificado en light?
