# Brief: Dashboard (lista de procesos)

**Ruta**: `/hiring-processes`. La pantalla del día a día: densidad de información, cero decoración.

## Función (se conserva)

1. Page header con título + botón de creación.
2. Filtros compactos: multi-select de estado (checkboxes, trigger muestra badges seleccionados + "+N"), select salary All/Declared/Not declared, inputs min/max cuando Declared, botón clear cuando hay filtros activos. Cambiar filtros resetea a página 1.
3. Tabla ordenable con paginación server-side: Company (link al detalle) · Job title · Status (badge) · Salary · Last update · Actions (view/edit/delete). Sort default: last update desc.
4. Pie: "Showing X to Y of Z" + rows per page (5/10/20/50) + first/prev/página/next/last.
5. Estados: skeleton, overlay de recarga, error, empty, diálogo de borrado.

## Directivas Tapuy

- **Tabla según spec**: filas 40px, hairline `border` entre filas, header en `text-muted` 11px, hover `surface-2`, sin zebra. **Salario alineado a la derecha en Geist Mono** con `tabular-nums`; fechas también en mono.
- **Un solo botón primario**: `Create process` (menta). Todo lo demás secondary/ghost. Los tres icon-buttons de acciones por fila quedan ghost, visibles solo on-hover de la fila si el diseño lo prefiere.
- Badges de estado según sistema: activos tintados con borde, terminales sólidos, sentence case ("First contact", "On hold").
- La menta aparece en ≤3 puntos en toda la vista (logo del header, botón primario, focus/selección). Los filtros no llevan acento.
- **Empty state del dashboard** (hoy es el más débil; copy literal): **Your pipeline starts here** / *Add the first company you're talking to.* / `Create process`. Merece composición propia (es lo primero que ve un usuario nuevo), pero sin ilustración estridente — puede usar el símbolo del logo en `text-muted`.
- Empty de filtros: **No processes match** / *Try widening the status or salary filter.* / `Clear filters`.
- Diálogo de borrado con el copy canónico (nombra empresa + nº de interacciones).

## Copy actual → nuevo

- "My Job Applications" → **Your processes** (la interfaz nunca dice "My"; unifica la terminología: se acabó mezclar applications/hiring processes/interviews — el término es **process**).
- "Manage your job applications" → eliminar o una línea útil (ej. conteo: `12 active · 8 closed` en Geist Mono).
- "Create Job Application" → **Create process**.
- "All Hiring Processes" (título de card) → eliminar; la tabla no necesita título dentro de una card. Evaluar quitar la card wrapper y asentar la tabla sobre `bg` directamente.
- "No interviews yet…" → reemplazado por el empty canónico.
