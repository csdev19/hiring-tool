# Tapuy — guía de implementación (para Claude Code)

Referencia única para implementar el rediseño. La identidad está **cerrada**: no se abre a discusión durante la implementación. Si algo estorba, se anota y se discute aparte.

Tokens: **`tapuy-theme.css`** (importar una vez en el root layout).
Referencia visual construida: `Landing.dc.html`, `Auth.dc.html`, `Dashboard.dc.html`.

---

## 1. Producto

**tapuy** (quechua: _preguntar_; se pronuncia ta-POOY). En prosa "Tapuy"; en código, URLs y lockups `tapuy` en minúsculas. **Nunca "TAPUY"**.

Tracker open source, self-hosted y Markdown-first de procesos de contratación y las entrevistas que los componen. El candidato lleva su pipeline de empresas; un equipo chico puede usar el mismo modelo desde el otro lado. **El timeline es el centro del producto, no la tabla.**

Los 5 principios: _Your side of the table_ · _Memory is leverage_ · _Numbers, not vibes_ · _Calm by default_ · _Yours to run_.

### Terminología (unificada — no mezclar)

| Usar                                   | No usar                                         |
| -------------------------------------- | ----------------------------------------------- |
| **process** (proceso de contratación)  | application, job application, interview process |
| **interaction** (entrada del timeline) | note, entry, event                              |
| "Your processes"                       | "My processes" / "My job applications"          |

---

## 2. Sistema visual en una línea

**90 / 9 / 1**: 90% neutros azulados, 9% los 8 colores de estado, 1% los neones. Dark mode es el default y el escaparate; light existe y es correcto.

### Reglas no negociables

1. En un screenshot del dashboard la **menta aparece en ≤3 puntos**.
2. **Un solo botón primario por vista.** El resto secondary (`border-strong`, fondo transparente) o ghost.
3. Neón **nunca** como fondo de un área mayor que un botón (ni headers, ni cards, ni banners).
4. Neón como texto **solo ≤14px**.
5. Los neones **no conviven** en la misma superficie. Excepción única: logo, og:image y hero de landing.
6. **Sin gradientes, sin glow, sin sombras de color.** El neón es plano; el brillo lo da el contraste.
7. Nunca `#000`/`#FFF` como fondo de página. Nunca grises cálidos.
8. Dark primero; cada componente se verifica en light después.

### Roles de los neones

| Color              | Rol                 | Dónde                                                                        |
| ------------------ | ------------------- | ---------------------------------------------------------------------------- |
| Menta `--mint`     | Acento del producto | Botón primario, focus ring, links, selección, punto del logo, tab activo     |
| Fucsia `--fuchsia` | El momento          | **Solo** `offer-made` y el nodo `offer` del timeline. Nada más es fucsia.    |
| Violeta `--violet` | Textura de marca    | Landing, README, og:image, `first-contact`. Casi invisible dentro de la app. |

Texto sobre neón: el tono oscuro de su propia familia (`--mint-on`, `--fuchsia-on`, `--violet-on`). Nunca negro ni blanco puros.

### Estados (8, sin paleta semántica aparte)

Regla estructural: **activos = badge tintado con borde**; **terminales = badge sólido**. La categoría se lee por forma antes que por color.

- Activos: `first-contact` (violeta) · `ongoing` (azul) · `on-hold` (ámbar) · `offer-made` (fucsia)
- Terminales: `offer-accepted` · `hired` (verde hoja, no menta) · `rejected` (rojo franco, no neón) · `dropped-out` (gris)

success reutiliza `hired`, warning `on-hold`, info `ongoing`. Danger propio: `--danger`.

### Tipografía

| Uso                                        | Fuente               | Detalle                                                                |
| ------------------------------------------ | -------------------- | ---------------------------------------------------------------------- |
| UI                                         | **Geist**            | Pesos 400 y 500 **únicamente**. 600/700 nunca.                         |
| Cifras (salarios, fechas, IDs, contadores) | **Geist Mono**       | `tabular-nums`.                                                        |
| Display                                    | **Instrument Serif** | Solo titulares de landing/README/og:image. **Nunca dentro de la app.** |

Escala: 12 metadata · 13 tabla y badges · 14 cuerpo · 16 prosa Markdown del timeline (line-height 1.7) · 20 h3 · 24 h2 · 32 h1 de página. Landing libre.

### Logo

Signo de interrogación reducido a su gesto mínimo: **arco abierto + punto**. Punto siempre menta (en light `#00A67E`); arco en `--text`. Variantes: símbolo solo (favicon, app icon al 60% del canvas sobre `#0A0F14`), lockup horizontal (símbolo + "tapuy" en Geist 500 minúsculas, tracking −0.01em), lockup landing (+ tagline en Instrument Serif). Sin versiones fucsia/violeta del símbolo.

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M7 9a5 5 0 1 1 5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="12" cy="20" r="2" fill="var(--mint)"/>
</svg>
```

### Qué no hacer

Neón como relleno de barras/gráficos (usar estados tintados) · violeta dentro de la app fuera de `first-contact` · gradiente menta→violeta · badges con emoji o ícono · confeti al marcar `hired`.

---

## 3. Voz y copy

Un colega competente que habla en llano. Segunda persona, contracciones en inglés, **cero exclamaciones** en copy de sistema. **Sentence case en todo** (botones, títulos, tabs, badges). Sin punto final en labels; con punto en helper text y empty states. Confirmaciones en pasado sin sujeto ("Saved").

**Botones** — verbo primero, 1–3 palabras: `Create process` · `Log interaction` · `Save` · `Cancel` · `Clear filters` · `Delete process`. Nunca `OK`, `Submit`, `Click here`.

**Toasts** (pasado, sin "successfully"): `Process created` · `Interaction saved` · `Marked as rejected. The notes stay.` · `Marked as hired.` (sin celebración).

**Destructivas** (qué, cuánto, irreversible; sin "Are you sure?"):

> Delete Acme Corp and its 12 interactions? This can't be undone. → `Delete process` / `Cancel`

**Errores** (qué pasó + qué hacer, sin prefijo "Error:"):

> Couldn't save the interaction. Check your connection and try again. · Content needs at least 10 characters. · That email's already registered. Sign in instead.

**Empty states**

| Dónde                  | Título                    | Cuerpo                                               | CTA                     |
| ---------------------- | ------------------------- | ---------------------------------------------------- | ----------------------- |
| Timeline vacío         | Nothing logged yet        | Write down what happened. Future you will thank you. | `Log first interaction` |
| Dashboard vacío        | Your pipeline starts here | Add the first company you're talking to.             | `Create process`        |
| Filtros sin resultados | No processes match        | Try widening the status or salary filter.            | `Clear filters`         |

**Placeholders** (ejemplo real, sin "e.g."): Company `Acme Corp` · Job title `React Native Developer` · Contact `Ana Torres, Engineering Manager`.

**Palabras prohibidas:** "job hunt/hunter/quest", "land your dream job", "stay motivated", "you got this", "leverage/seamless/unlock/empower/supercharge", "AI-powered" como promesa. Estados terminales nunca "lost", "failed", "gave up".

---

## 4. Pantallas

### `/` — Landing (`Landing.dc.html`)

Única superficie donde los tres neones pueden convivir y donde vive Instrument Serif. Base `#0A0F14`, sin gradientes ni glow.

- Header: lockup tapuy · Dashboard (con sesión) · Sign in / user menu · `Star on GitHub` (secundario permanente).
- Hero: kicker _Ask. Listen. Remember._ (violeta, mono) → H1 **Every question in the process, on record.** (Instrument Serif, "on record" en itálica) → subtítulo _The interview log for people who want to remember._ → descripción del About de GitHub.
- CTAs condicionales: sin sesión `Create account` (primario) + `Sign in` (secundario); con sesión `Open your pipeline`.
- **Pieza central: mock del timeline en dark** (no la tabla) — la misma imagen que usa el README. Nodo de oferta en fucsia.
- 3 features (una por principio): **Pipeline** con los 8 badges reales · **Numbers, not vibes** con cifras en Geist Mono · **Timeline** con Markdown crudo.
- Los 5 principios como sección de texto (mismo contenido que el README).
- **Yours to run**: self-hosted, tu Postgres, `git clone` + `Star on GitHub`.
- CTA final + footer de una línea: `tapuy — every question in the process, on record` + GitHub/Docs.

### `/auth/login`, `/auth/signup` — Auth (`Auth.dc.html`)

Con sesión redirigen al dashboard. Better Auth, email + password; signup agrega nombre.

- Columna centrada sobre `bg`: lockup arriba + tagline _Ask. Listen. Remember._ en `text-secondary`. Sin split-screen ni ilustración — la sobriedad es la marca.
- Card del form sobre `surface`, inputs `surface-2`. Un solo primario (submit, full-width).
- Validación (zod): email válido, password ≥8, nombre requerido en signup. Errores inline en `--danger`, **no** `text-red-500`.
- Email duplicado: _That email's already registered._ + link `Sign in instead.`
- h1 `Sign in` / `Create your account`. Submit `Sign in` / `Create account`; enviando `Signing in…` / `Creating account…`.
- Cross-links: `No account? Create one` / `Already have an account? Sign in`.
- Toast éxito: `Signed in` (o ninguno — la navegación ya lo comunica) y navegar al dashboard.

### `/hiring-processes` — Dashboard (`Dashboard.dc.html`)

Densidad de información, cero decoración. **Sin card wrapper**: la tabla se asienta sobre `bg`.

- Header de página: h1 **Your processes** (32px) + conteo `12 active · 4 closed` en Geist Mono. Único primario: `Create process`.
- Filtros compactos, **sin acento**: multi-select de estado (checkboxes; el trigger muestra el estado seleccionado + `+N`), select salary All/Declared/Not declared, min/max cuando Declared, `Clear filters` (ghost) solo si hay filtros activos. **Cambiar cualquier filtro resetea a página 1.**
- Tabla ordenable, paginación server-side: Company (link al detalle) · Job title · Status (badge) · Salary · Last update · acciones. Sort default `last update desc`. Filas 40px, hairline `border`, header `text-muted` 11px, hover `surface-2`, **sin zebra**. Salario a la derecha en Geist Mono `tabular-nums`; fechas también en mono.
- Acciones por fila: 3 icon-buttons ghost (view/edit/delete), `text-muted` → `text` en hover.
- Pie: `Showing X to Y of Z` (mono) + rows per page 5/10/20/50 + first/prev/página/next/last.
- Estados: skeleton (filas de 40px con barras `surface-2`), overlay de recarga, error, empty, diálogo de borrado.
- Empty canónico con el símbolo del logo en `text-muted` — sin ilustración estridente.

---

## 5. Implementación

- Importar `tapuy-theme.css` una vez en el root layout; **no hard-codear hexes** — todo vía `var(--*)`.
- Dark es el default: `<html data-theme="dark">`. Light con `data-theme="light"` (mismo set de variables).
- Geist y Geist Mono con `next/font` (paquete `geist`); Instrument Serif solo en las rutas de landing.
- El focus ring `--focus-ring` es global vía `:focus-visible` — no reemplazarlo por outline del navegador ni por ring de Tailwind por defecto.
- Con Tailwind: mapear los tokens en `theme.extend.colors` / `fontFamily` leyendo las CSS vars; nada de `text-red-500`, `bg-zinc-900` ni utilidades de color fuera del set.
- Cifras siempre con `.mono` / `tabular-nums`: salarios, fechas, IDs, contadores, paginación.
- Checklist antes de mergear una vista: ¿un solo primario? ¿menta en ≤3 puntos? ¿badges con la forma correcta según categoría? ¿cifras en mono? ¿copy en sentence case sin exclamaciones? ¿verificado en light?
