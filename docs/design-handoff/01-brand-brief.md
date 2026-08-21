# Brand Brief — insumos para nombre, filosofía e identidad

Este archivo es el material para la sesión de branding con Claude. No define la marca: reúne lo que la app _ya es_ para que el nombre y la filosofía salgan de ahí y no de un moodboard genérico.

## Dirección estratégica (decidida, 2026-08)

**Camino elegido: open source primero**, con la puerta abierta a monetizar después vía versión hosted (modelo Cal.com/Plausible: self-hosted gratis, hosted de pago para quien no quiere infra).

Consecuencias para la marca:

1. **Nombre neutral de lado.** El producto debe servir al candidato (dev que trackea su búsqueda) y potencialmente al otro lado (empresa chica que contrata poco, bootcamps/agencias trackeando pipelines de sus candidatos). Se descartan los territorios de "caza de trabajo" (job hunt, etc.); ganan los de **pipeline / bitácora / proceso / conversaciones**, que funcionan desde ambos lados de la mesa.
2. **La identidad ES la estrategia de lanzamiento.** En open source, los proyectos que despegan son los que parecen producto: nombre propio, logo, README con screenshots, landing pulida (Excalidraw, Cal.com). El rediseño no es cosmético, es distribución.
3. **El repo es doble producto**: la app + la arquitectura de referencia (monorepo DDD/hexagonal, Hono + Workers + Better Auth + Drizzle/Prisma + TanStack + Expo). El README debe vender ambos.
4. **Monetización = opción futura, no objetivo.** No diseñar pricing ni paywalls; sí evitar decisiones de marca que bloqueen un hosted de pago más adelante. Pendiente antes de publicar: elegir licencia (MIT = totalmente libre; AGPL = protege la opción de hosted propio).

## La idea central del producto

**Es la memoria y el mapa de tu búsqueda de trabajo.** Dos verdades que la app ya expresa en su UI:

1. **Del lado del candidato.** Todo ATS existente (Greenhouse, Lever, Workable) es para el que contrata. Esta app invierte la perspectiva: el candidato es quien gestiona _su_ pipeline de empresas. Las empresas son filas en _tu_ tabla.
2. **La memoria vale oro.** El empty state del timeline lo dice: _"Start by logging your first meeting or note. It will help future you remember why this mattered."_ El producto apuesta a que documentar cada interacción (con Markdown, con tipos, con fechas) te da ventaja: negocias mejor, comparas mejor, no te pierden los hilos.

## Emociones del contexto de uso

Buscar trabajo es estresante, asimétrico y opaco. El usuario llega ansioso, con rechazos acumulados y procesos fantasma. La app debería sentirse como lo contrario:

- **Control**: convertir el caos en una tabla ordenada con estados de colores.
- **Calma / claridad**: nada de gamificación ni presión; los estados terminales (rejected, dropped-out) se tratan con neutralidad, no como fracaso.
- **Agencia**: el candidato deja de ser evaluado pasivamente y pasa a evaluar — registra salarios, beneficios, cuántas etapas tiene cada proceso, quién lo contactó.

## Personalidad sugerida (a discutir)

- Herramienta seria de trabajo, no red social ni app motivacional. Más cerca de Linear/Notion que de Duolingo.
- Honesta con los datos: salarios en números, estados en colores francos (rojo es rojo).
- Discreta: es un diario privado de negociaciones; la estética puede reflejar esa privacidad (sobria, densa en información, confiada).

## Territorios de naming (puntos de partida)

Conceptos presentes en el producto de donde puede salir el nombre:

- **Pipeline / tracking**: el flujo de estados, el progreso etapa por etapa.
- **Memoria / bitácora**: timeline, interacciones, "future you". Territorio de logbook, diario, registro.
- **Lado del candidato**: la inversión de la mesa; "mi proceso", "mi búsqueda".
- ~~**Búsqueda / caza**: hunt, search, quest~~ — descartado por la dirección estratégica: es de un solo lado de la mesa y está quemado (JobHunter et al.).
- **Negociación / datos**: salarios, ofertas, comparación entre procesos.

Restricciones prácticas: el nombre actual "Hiring Tool"/"interviews-tool" es placeholder; los paquetes usan el scope `@interviews-tool/*` (renombrar el scope es un cambio mecánico pero tocaría todo el monorepo, decidir si vale la pena en la misma pasada). Monedas soportadas hoy: USD y PEN — hay un guiño peruano/latam en el ADN del producto que puede (o no) informar la marca.

## Preguntas que la sesión de branding debe responder

1. ¿Nombre? (+ disponibilidad razonable de dominio; no hace falta el .com perfecto para lanzar)
2. ¿Tagline de una línea? (hoy: "Track Your Job Applications — All in One Place", funcional pero genérico)
3. ¿Filosofía en 3–5 principios? (ej. "tu búsqueda es tuya", "los datos te dan poder de negociación", "la memoria es ventaja")
4. ¿Personalidad y tono de voz? (microcopy: empty states, toasts, confirmaciones de borrado)
5. ¿Dirección visual? — paleta propia (hoy todo es el gris neutro de shadcn), tipografía con carácter, tratamiento de los 8 colores de estado como sistema semántico de la marca, dark mode como ciudadano de primera.
6. ¿Logo/marca gráfica? — algo que funcione en favicon, header web y app icon móvil.

## Lo que la identidad tiene que resolver sí o sí en el UI

- **Los 8 badges de estado** son el elemento visual más repetido de la app (tabla, detalle, filtros, móvil). Hoy usan colores Tailwind crudos. La paleta de estados ES la marca en la práctica.
- **El timeline de interacciones** es la pantalla emocional del producto (ahí vive la "memoria"). Merece el mayor cuidado de diseño.
- **Densidad de tabla** en el dashboard: mucha información, poco cromo.
- **Dark mode** ya está soportado técnicamente en web; la identidad debe nacer pensada para ambos temas.
