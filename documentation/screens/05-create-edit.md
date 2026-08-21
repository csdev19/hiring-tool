# Brief: Crear / Editar proceso

**Rutas**: `/hiring-processes/new` y `/hiring-processes/$id/edit`. Mismo formulario; edit precarga valores.

## Función (se conserva)

- Campos principales: **Company name\*** (único requerido) · Job title · Status (8 opciones ordenadas, default First contact) · fila salario: monto (máx 25.000) + rate (Monthly/Hourly, cambia el label) + moneda (USD/PEN).
- Sección colapsable **Company details** (opcional): Website, Location, Benefits (textarea), Contacted via (LinkedIn/Email/Facebook/Other), Contact person, Interview steps (número). Solo se envía si algo tiene valor; en edit se auto-abre si hay datos.
- Footer: Cancel + submit. Tras crear/editar navega al detalle con toast.

## Directivas Tapuy

- El diseño debe reforzar el mensaje: **registrar un proceso toma 10 segundos** — solo la empresa es obligatoria. Jerarquía: Company name grande arriba, lo demás visualmente secundario.
- **La fila salario/rate/moneda es el grupo estrella**: diseñarla como control compuesto coherente, monto en Geist Mono. Es la expresión de "Numbers, not vibes".
- Un solo botón primario: el submit. Cancel es ghost.
- Unificar todos los selects con el componente del design system (hoy hay `<select>` nativos mezclados).
- El select de Status usa los badges reales como opciones si es viable, o texto plano sentence case; nunca íconos.
- Inputs sobre `surface-2`, borde `border`, focus ring menta (el único acento de la vista además del submit).
- Placeholders canónicos: `Acme Corp` · `React Native Developer` · `Ana Torres, Engineering Manager` (sin "e.g.").
- Errores inline sin prefijo "Error:"; en danger, no en rojo genérico.

## Copy actual → nuevo

- "Create New Hiring Process" → **New process** · "Edit Hiring Process" → **Edit process**.
- Subtítulos actuales → eliminar o reducir a una línea.
- "Hiring Process Details" (card title) → eliminar (el h1 basta).
- "Company Details (Optional)" → **Company details** (el colapso ya comunica opcionalidad).
- "Hiring Process Steps" → **Interview steps**.
- Submit: **Create process** / **Save changes**. Estado enviando: **Saving…**.
- Toast: `Process created` / `Changes saved`.
