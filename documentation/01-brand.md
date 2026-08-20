# Tapuy — Brand (para sesiones de diseño)

Condensado de la identidad cerrada en 2026-08. Nada de esto está abierto a cambio durante el diseño de pantallas; si algo estorba, se anota y se discute aparte.

## Nombre y qué es

**Tapuy** — quechua: *preguntar* (raíz de *tapukuy*). Una entrevista es una secuencia de preguntas entre dos partes; el nombre es bidireccional por construcción. Pronunciación: **ta-POOY**. En prosa "Tapuy"; en código, URLs y lockups `tapuy` (minúsculas). Nunca "TAPUY".

**Qué es el producto:** tracker open source, self-hosted y Markdown-first de procesos de contratación y las entrevistas que los componen. El candidato lleva su pipeline de empresas (estados, salarios, contactos, timeline de interacciones); un equipo chico/bootcamp/agencia puede usar el mismo modelo desde el otro lado.

**Idea central:** *la memoria es ventaja.* El timeline es el centro del producto, no la tabla.

## Los 5 principios

1. **Your side of the table.** Quien registra, manda. El modelo no tiene lado.
2. **Memory is leverage.** Recordar qué te dijeron en la segunda llamada es poder de negociación.
3. **Numbers, not vibes.** Salario en cifras, moneda explícita, etapas contadas. Los datos no se adornan.
4. **Calm by default.** Sin gamificación ni confeti. Un rechazo es un estado, no un fracaso. La interfaz nunca juzga.
5. **Yours to run.** Open source, tus datos en tu Postgres. La privacidad es premisa.

## Taglines y mensajes canónicos

- Tagline principal: **Every question in the process, on record.**
- Lockup corto / splash: *Ask. Listen. Remember.*
- Subtítulo de landing: *The interview log for people who want to remember.*
- GitHub About: *Open-source interview and hiring process tracker. Log every conversation, offer, and decision — from either side of the table.*
- Español: *Cada pregunta del proceso, registrada.* / *Pregunta. Escucha. Recuerda.*

## Voz

Un colega competente que habla en llano. Segunda persona, contracciones en inglés, cero exclamaciones en copy de sistema. **Sentence case en todo** (botones, títulos, tabs, badges). Sin punto final en labels; con punto en helper text y empty states. La interfaz dice "Your processes", nunca "My processes". Confirmaciones en pasado sin sujeto ("Saved").

### Microcopy canónico (usar literal en los diseños)

**Botones** — verbo primero, 1–3 palabras: `Create process` · `Log interaction` · `Save` · `Cancel` · `Clear filters` · `Delete process`. Nunca `OK`, `Submit`, `Click here`.

**Empty states:**

| Dónde | Título | Cuerpo | CTA |
| --- | --- | --- | --- |
| Timeline vacío | Nothing logged yet | Write down what happened. Future you will thank you. | `Log first interaction` |
| Dashboard vacío | Your pipeline starts here | Add the first company you're talking to. | `Create process` |
| Filtros sin resultados | No processes match | Try widening the status or salary filter. | `Clear filters` |

**Toasts** (pasado, sin "successfully"): `Process created` · `Interaction saved` · `Marked as rejected. The notes stay.` · `Marked as hired.` (sin celebración).

**Confirmaciones destructivas** (qué, cuánto, irreversible; sin "Are you sure?"):
*Delete Acme Corp and its 12 interactions? This can't be undone.* → `Delete process` / `Cancel`.

**Errores** (qué pasó + qué hacer, sin prefijo "Error:"): *Couldn't save the interaction. Check your connection and try again.* · *Content needs at least 10 characters.* · *That email's already registered. Sign in instead.*

**Placeholders** (ejemplo real, sin "e.g."): Company `Acme Corp` · Job title `React Native Developer` · Contact `Ana Torres, Engineering Manager`.

**Estados terminales:** "Rejected" y "Dropped out" se nombran con neutralidad; nunca "lost", "failed", "gave up".

### Palabras prohibidas

"Job hunt/hunter/quest", "land your dream job", "stay motivated", "you got this", "leverage/seamless/unlock/empower/supercharge", "AI-powered" como promesa.

## Personalidad de referencia

Herramienta seria de trabajo: más Linear/Notion que Duolingo. Honesta, discreta (diario privado de negociaciones), confiada.
