# Brief: Detalle de proceso + Timeline

**Ruta**: `/hiring-processes/$id`. **La pantalla escaparate**: de aquí salen el screenshot del README y la og:image. Diseñarla primero; fija el tono del resto.

## Función (se conserva)

Ver todo lo de un proceso y registrar interacciones sin fricción. Estructura actual que funciona y se mantiene:

1. **Sticky header contextual** al scrollear (empresa / puesto / badge / salario + acciones edit y delete), con backdrop blur.
2. **Card principal**: empresa (título), puesto, badge de estado, acciones Edit/Delete, grid de datos (Salary, Status, Created, Last updated) y accordion "Complementary information" con website/location/contactedVia/contactPerson/interviewSteps/benefits (solo si existen).
3. **Layout dos columnas**: form de nueva interacción **sticky a la izquierda** (Title opcional ≤100, Type select de 10 tipos default Note, contenido **Markdown** 10–10.000 chars con contador, botón submit) + **timeline a la derecha**.
4. Diálogos: borrar proceso, editar/borrar interacción. Toasts tras cada mutación.
5. Estados: skeleton, error, not-found.

## Directivas Tapuy

- **El timeline es el producto** (principio 2). Máximo cuidado: línea `border-strong`, nodos 8px `text-muted`, nodo `offer` en **fucsia** y nodo `rejection` en rojo `rejected` — son los únicos nodos con color. Card sobre `surface`, título 14/500, fecha en Geist Mono `text-muted`, contenido Markdown a 16px/1.7 (la única zona con aire de la app).
- Badges de tipo de interacción: mismo lenguaje que los de estado (sentence case, sin ícono dentro del badge — los íconos lucide actuales se eliminan del badge; pueden vivir en el nodo o desaparecer).
- **Un solo botón primario en la vista**: el submit del form (`Log interaction`). Edit/Delete del proceso son ghost/secondary; Delete con hover danger.
- Salario en Geist Mono, protagonismo visual dentro del grid de datos (es el dato estrella).
- Empty state del timeline (copy literal): **Nothing logged yet** / *Write down what happened. Future you will thank you.* / `Log first interaction`.
- Toasts canónicos: `Interaction saved` · `Marked as rejected. The notes stay.`
- Confirmación de borrado: *Delete {company} and its {n} interactions? This can't be undone.* → `Delete process` / `Cancel`.
- Sin celebración al pasar a hired; el badge verde sólido es todo el mensaje.
- El editor Markdown (`@uiw/react-md-editor`) debe tematizarse con los tokens (hoy trae estilos propios light/dark duplicados); si el diseño propone reemplazarlo por un textarea con preview, mejor.

## Copy actual → nuevo

- "Interaction History" → **Interactions** (o "Log"; sentence case).
- "New Interaction" → **Log interaction**.
- "Complementary Information" → **Company details**.
- "Back to Hiring Processes" → **Back to processes**.
