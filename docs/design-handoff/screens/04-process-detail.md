# Pantalla: Detalle de proceso + Timeline

**Ruta**: `/hiring-processes/$id` — `apps/web/src/routes/_authenticated/hiring-processes/$id.tsx`
**Componentes**: `interaction/` (timeline, card, form, dialogs), `hiring-process/status-badge`, `delete-confirm-dialog`
**Acceso**: autenticado. **Es la pantalla más rica y el corazón emocional del producto.**

## Propósito

Ver todo lo de un proceso (datos + historia) y registrar interacciones nuevas sin fricción.

## Estructura actual (top → bottom)

1. **Sticky header contextual** (aparece al scrollear pasando la card principal, con IntersectionObserver + fade/slide): ← back, "Empresa / Puesto" truncados, StatusBadge, salario con ícono $, icon-buttons Edit/Delete. Fondo `bg-background/95` con backdrop-blur.
2. **Botón "← Back to Hiring Processes"**.
3. **Card principal del proceso**:
   - Título grande = companyName; puesto con ícono Briefcase; StatusBadge.
   - Acciones: Edit (→ pantalla de edición) y Delete (diálogo, hover rojo).
   - Grid de 4 datos: Salary (formateado `$4,500/monthly`), Status (badge), Created, Last Updated (fechas largas con hora).
   - **"Complementary Information"** (solo si hay company details): Accordion colapsable con grid de website (link externo con ícono si es URL válida), location (MapPin), contactedVia (MessageSquare), contactPerson (User), interviewSteps, y benefits en bloque aparte (texto multilínea).
4. **"Interaction History"** — layout dos columnas (2fr / 5fr en desktop, apiladas en móvil):
   - **Izquierda (sticky al scroll)**: card "New Interaction" con el form: Title opcional (máx 100 chars), Type (select de 10 tipos, default Note), Content en **editor Markdown** (`@uiw/react-md-editor`, altura 150, mín 10 / máx 10.000 chars con contador), botón full-width "Add Interaction".
   - **Derecha**: **timeline vertical** — línea `w-px` a la izquierda con un dot por entrada; cada `InteractionCard`:
     - Fila superior: `InteractionTypeBadge` (ícono + label, variante según tipo; Rejection en destructive) + fecha con hora; acciones Pencil/Trash2 reveladas on-hover.
     - Título opcional con borde izquierdo `border-primary/50`.
     - Contenido Markdown renderizado (`MarkdownContent` compact), colapsado a 200px con botón "Read more"/"Show less" si desborda.
     - Hover de card: `bg-muted/30`.
   - **Empty state** (el mejor de la app): ícono MessageSquarePlus en círculo muted + "No interactions yet" + _"Start by logging your first meeting or note. It will help future you remember why this mattered."_

## Diálogos

- `DeleteConfirmDialog` (proceso, nombra la empresa).
- `EditInteractionDialog` y `DeleteInteractionDialog` (por interacción).

## Estados

- Skeleton propio (`HiringProcessDetailSkeleton`), error con botón de vuelta, not-found con botón de vuelta.
- Toasts en delete de proceso y CRUD de interacciones.

## Notas para el redesign

- El timeline es donde la identidad puede brillar: dots/línea por tipo o estado, tipografía de las notas, jerarquía fecha/badge/contenido.
- El patrón sticky (header contextual + form de captura) ya funciona bien — conservarlo.
- El editor Markdown tiene estilos propios de la librería que chocarán con cualquier tema; está duplicado en DOM para light/dark (deuda conocida) y hay que themearlo o reemplazarlo.
- Los 4 datos del grid superior son casi todos metadata; el dato estrella (salario) podría tener más protagonismo visual.
