# Captura en vivo — spec de la v2

Qué cambia en `/hiring-processes/$id` y por qué. Referencia construida: `ProcessDetail v2.dc.html` (la v1 queda intacta en `ProcessDetail.dc.html`).
Tokens en `tapuy-theme.css` · sistema en `DESIGN.md` · el resto de la pantalla en `BUILD-process-screens.md`.

---

## El problema

La v1 estaba diseñada para **archivar después**; el uso real es **escribir durante**, en pantalla partida con la videollamada. Tres fallos concretos, reportados en uso:

1. El área de escritura era estrecha, estaba a un lado y no se veía completa.
2. El scroll se volvía incómodo a medida que llegaban líneas.
3. Un click accidental en un link borró notas sin guardar.

Y dos estructurales: el formulario pedía Title y Type **antes** de escribir (ceremonia que solo tiene sentido al final), y una entrevista de 60 minutos no cabe en un único submit.

---

## Las seis piezas

### 1. Notepad, no formulario

El orden se invierte: **Notes primero**, luego una fila `Type` (150px) + `Title` (resto), luego el submit. Se escribe primero y se clasifica al final.

- Columna izquierda de **360 → 440px**.
- Textarea con **auto-grow**: `height:auto` → `scrollHeight`, mínimo 200px, tope `52vh`, y a partir de ahí scroll interno. Se recalcula en cada `input`. Esto resuelve el fallo 1 y 2 sin abrir el modo vivo.
- **⌘↵ / Ctrl+↵** envía desde el textarea.
- Pie del área: `/ for shortcuts · ⌘↵ to save` a la izquierda, contador mono a la derecha.

### 2. Modo vivo (`Start live note`)

Overlay `position:fixed; inset:0; z-index:70` sobre `bg`. Se abre desde el header de Interactions, desde el sticky header y desde el empty state. **Esc** cierra (el borrador queda guardado).

**Top bar 52px** — flex, hairline inferior:

- Punto fucsia 7px (grabando) + **cronómetro** en mono `tabular-nums` (`12:04`, `1:03:22`), corre desde que se abre.
- Contexto: empresa (14/500, `flex-shrink:0` — nunca se recorta) · puesto (13 `text-muted`, cede primero) · badge de estado · salario en mono.
- Derecha: `Draft saved 9:14` (mono 12, elipsis) · `Hide panel` secondary · **`Save interaction`** primario · cerrar (ghost 30px). Los tres botones `flex-shrink:0; white-space:nowrap`.

**Editor** — `flex:1`, textarea a **Geist Mono 15 / 1.8**, padding 28, sin borde ni fondo propio: el texto está sobre `bg`, a toda la anchura disponible.

- **Sin focus ring**: `#live-content:focus { box-shadow:none; caret-color:#00FFC2 }`. Un marco menta de 600×450 rompería las reglas de dosificación; el cursor menta es el indicador.
- Bajo el editor, chips de inserción rápida (Timestamp · Question I asked · Figure · Next step) para quien prefiere ratón.

**Panel derecho** — `aside` de **320px `box-sizing:border-box`**, colapsable con `Hide panel`. En pantalla partida se cierra y el texto recupera los 320px. Contiene:

- **Questions to ask** con checkboxes (ver 4).
- **Earlier notes**: las 4 últimas interacciones como badge + fecha mono + extracto de 150 caracteres. El extracto limpia marcadores Markdown **por línea** (`/^\s*(?:[-*>#]+\s*)+/gm`), nunca globalmente: `Sign-on`, `take-home`, `async-first` deben sobrevivir — es el panel cuyo trabajo es recordar con exactitud.

Al guardar: se crea **una** interacción con la duración medida (`· 1h 34m` si superó el minuto), se limpia el borrador y se cierra el overlay.

### 3. `/` para insertar

Se detecta con `(?:^|\s)\/(\w*)$` sobre el texto anterior al cursor. Menú de 250–260px sobre el área de escritura; `↑ ↓` navegan, `Enter`/`Tab` insertan, `Esc` cierra, hover cambia la selección. Al insertar se **reemplaza el `/query`** (se guarda `slashAt`).

| Ítem              | Inserta           |
| ----------------- | ----------------- |
| Timestamp         | `**9:14 AM** `    |
| Question I asked  | `**Q:** `         |
| Figure            | `` `$` ``         |
| Next step         | `**Next step:** ` |
| Follow up on this | `- [ ] `          |

Detalle de cursor: si el textarea no ha sido tocado (`dataset.touched !== '1'`), la inserción va **al final**, no en la posición 0 — si no, recuperar un borrador y tildar una pregunta escribía arriba del todo. Al abrir el modo vivo el caret se coloca al final (`setSelectionRange(len, len)`).

### 4. Questions to ask

Dos orígenes, mezclados en una sola lista:

- **Lista por defecto** reutilizable en todos los procesos (`scope: 'default'`, editable desde ajustes → `Edit defaults`).
- **Preguntas del proceso** (`scope: 'process'`), añadidas con el input `Add a question`.

Cada pendiente muestra su origen en mono 11: `default list`, `this process`, o **`carried from Aug 11`** en violeta cuando quedó sin hacer en la conversación anterior. Las hechas se agrupan bajo `Show N asked` con tachado.

Comportamiento distinto según contexto:

- En la columna normal, tildar solo marca la pregunta como hecha.
- **En el modo vivo, tildar escribe `**Q:** <pregunta>` en la nota** en la posición del cursor, además de marcarla. La leyenda del panel lo dice: _Ticking a question writes it into your note._

### 5. Borrador que no se pierde

- Se persiste en `localStorage`, clave **`tapuy:draft:v2:<slug del proceso>`**, con `{content, title, type, at}`, en cada cambio de contenido, título o tipo. Contenido vacío → se borra la clave.
- Indicador `Draft saved 9:14` en mono `text-muted` (form y top bar del modo vivo).
- Al montar, si hay borrador se restaura y aparece una tira: _Draft restored from 4:32 PM_ + `Discard`.
- Al guardar la interacción, **se limpia la clave**.
- **Guardas de salida**: `beforeunload` cuando hay texto sin guardar, y un listener de click en captura sobre `a[href]` (ignora anclas `#`) que abre el diálogo _You have an unsaved note · It stays as a draft on this device — nothing is lost if you leave._ → `Leave anyway` / `Keep writing`.

### 6. Captura rápida y plantillas

- **Quick capture**: input de 40px sobre el timeline, `What just happened? Enter logs a note`. Enter crea una interacción tipo Note sellada con la hora (`**9:14 AM** …`). Para fragmentos sueltos entre llamadas.
- **Plantillas por tipo**: elegir `Offer`, `Call`, `Technical interview`, `Interview` o `Rejection` **con el área vacía** inserta su esqueleto (Offer → base / deadline / _not in the letter yet_). Nunca sobrescribe texto existente; toast `Template inserted`.

---

## Reglas que siguen valiendo

- **Un primario por superficie**: `Log interaction` en la vista normal, `Save interaction` en el modo vivo. Todo lo demás secondary/ghost.
- Menta en ≤3 puntos: logo, primario y caret/focus. El modo vivo **no** tiene focus ring.
- Nodo `offer` fucsia, nodo `rejection` rojo; ningún otro con color.
- Cifras, horas, cronómetro y contadores en Geist Mono con `tabular-nums`.
- Sin celebración, sin exclamaciones, sentence case.

## Nota de implementación

El timeline pasa a ser **data-driven** (array de interacciones en estado) para que la captura rápida y el modo vivo puedan añadir entradas sin recargar. Modelo mínimo por interacción: `{ id, type, title, body, date, time, duration }`.
