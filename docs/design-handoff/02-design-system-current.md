# Estado actual del diseño (y qué falta)

## Diagnóstico honesto

La app funciona end-to-end pero visualmente es "shadcn por defecto": tokens neutros (`background`, `muted`, `primary`), tipografía del sistema, cero identidad. Nada está roto — está *sin diseñar*. Todo el layout y la jerarquía funcional ya existen; lo que falta es una capa de identidad encima.

## Sistema de componentes actual

Paquete propio `@interviews-tool/web-ui` (estilo shadcn sobre Tailwind CSS 4 + Base UI):

- **Primitivos**: `Button` (variants: default, outline, ghost, destructive; sizes hasta `icon-xs`), `Input`, `Label`, `Textarea`, `Badge`, `Skeleton`.
- **Composición**: `Card` (+Header/Title/Content), `Table` (+Header/Body/Row/Cell), `DropdownMenu` (con checkbox items), `Select`, `Accordion`, `MarkdownContent` (render de Markdown con variante `compact`).
- **Íconos**: lucide-react en toda la app (Briefcase, Building2, MessageSquare, TrendingUp, Pencil, Trash2, Eye, MapPin, DollarSign…).
- **Toasts**: sonner (success/error tras cada mutación).
- **Markdown editor**: `@uiw/react-md-editor` en el form de interacciones (tiene su propio theming light/dark que hoy se maneja con dos instancias duplicadas).
- **Inconsistencia conocida**: varios formularios usan `<select>` nativo con clases manuales en vez del componente `Select` (hiring-process-form, tabla de paginación). Unificar cuando se haga el redesign.

## Tokens actuales

- Colores: los CSS variables estándar de shadcn (`--background`, `--foreground`, `--muted`, `--primary`, `--destructive`, `--border`…). No hay paleta de marca.
- Dark mode: vía clase `dark:`, ya cableado en todos los componentes web.
- Radios: `rounded-md` / `rounded-lg` por defecto.
- Tipografía: system font stack, sin fuente propia.

## El sistema semántico de estados (lo más importante a rediseñar)

Los colores canónicos viven en el dominio (`HIRING_PROCESS_STATUS_INFO.color`, hex) y la web los **duplica** con clases Tailwind en `status-badge.tsx`. Dos fuentes de verdad:

| Estado | Hex (dominio, usa móvil) | Tailwind (web badge) |
| --- | --- | --- |
| first-contact | `#8b5cf6` | purple-100/800 |
| ongoing | `#3b82f6` | blue-100/800 |
| on-hold | `#f59e0b` | yellow-100/800 |
| offer-made | `#06b6d4` | cyan-100/800 |
| offer-accepted | `#10b981` | emerald-100/800 |
| hired | `#22c55e` | green-100/800 |
| rejected | `#ef4444` | red-100/800 |
| dropped-out | `#6b7280` | gray-100/800 |

Al definir la paleta de marca, estos 8 colores deben rediseñarse como familia coherente (misma saturación/luminosidad percibida, legibles en light y dark) y unificarse en una sola fuente de verdad en el dominio.

Los tipos de interacción (10) usan las variantes genéricas de `Badge` (default/secondary/destructive/outline) + ícono lucide — también sin sistema propio.

## Patrones de UX ya establecidos (conservar en el redesign)

- **Skeletons** por pantalla (tabla, detalle, edit) durante la carga.
- **Empty states** con ícono + mensaje + sub-mensaje (el del timeline tiene el mejor copy de la app).
- **Confirmación de borrado** vía diálogo, siempre nombrando la empresa afectada.
- **Sticky header contextual** en el detalle: al scrollear, aparece una barra con empresa/puesto/estado/salario + acciones (IntersectionObserver).
- **Form sticky** de nueva interacción en columna izquierda del detalle.
- **Acciones reveladas on-hover** en las cards de interacción (editar/borrar).
- **Collapse "Read more"** en interacciones largas (>200px).
- **Secciones opcionales colapsables** en formularios (Company Details).

## Qué falta (la tarea de Claude Design)

1. **Identidad**: nombre, logo, favicon, app icon.
2. **Paleta de marca** + rediseño de los 8 colores de estado como sistema.
3. **Tipografía** propia (display + body + mono para cifras de salario).
4. **Tokens** completos: spacing, radios, sombras, elevación — hoy es todo default.
5. **Landing** con la nueva marca (la actual es puro texto genérico con 6 cards de features).
6. **Header/nav** con logo (hoy es texto "Hiring Tool" plano).
7. **Móvil**: la app Expo usa estilos hardcodeados (`#0a7ea4` como primary heredado del template de Expo, fondo dark fijo) totalmente desconectados del web — necesita los mismos tokens.
8. **Voz y microcopy** consistentes con la marca (hoy inglés funcional).
