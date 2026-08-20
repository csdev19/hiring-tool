# Pantalla: Dashboard / Lista de procesos

**Ruta**: `/hiring-processes` — `apps/web/src/routes/_authenticated/hiring-processes/index.tsx`, tabla en `components/hiring-process/hiring-process-table.tsx`
**Acceso**: autenticado. Es la pantalla principal del día a día.

## Propósito

Ver todo el pipeline de procesos de un vistazo, filtrarlo, y entrar/editar/borrar cada proceso.

## Estructura actual

1. **Page header**: H1 "My Job Applications" + subtítulo + botón primary "＋ Create Job Application" a la derecha.
2. **Card "All Hiring Processes"** que contiene filtros + tabla:

### Filtros (fila superior, compactos h-8)
- **Status**: dropdown multi-select con checkboxes de los 8 estados; el trigger muestra hasta 3 `StatusBadge` seleccionados + contador "+N".
- **Salary**: select All / Declared / Not declared.
- **Min/Max salary**: inputs numéricos, solo visibles cuando Salary = Declared.
- **Clear filters**: botón ghost con ✕, solo visible con filtros activos. Cambiar filtros resetea a página 1.

### Tabla (TanStack Table, paginación server-side)
Columnas:
| Columna | Contenido | Sortable |
| --- | --- | --- |
| Company | link al detalle, truncado a 200px | ✓ |
| Job Title | texto muted, truncado, "-" si vacío | ✓ |
| Status | `StatusBadge` de color | ✗ |
| Salary | `$4,500/monthly` formateado con moneda y tarifa; "-" si no declarado | ✓ |
| Last Update | fecha corta, muted | ✓ (default: desc) |
| Actions | 3 icon-buttons ghost: Eye (ver), Pencil (editar), Trash2 (borrar con diálogo de confirmación) | — |

- Hover de fila: `bg-muted/50`.
- Indicador de sort: flecha ↑/↓ textual.

### Paginación (pie de tabla)
- "Showing X to Y of Z entries" a la izquierda.
- "Rows per page" (5/10/20/50, default 5) + botones first/prev/página "N of M"/next/last a la derecha.

## Estados de la pantalla

- **Cargando**: `HiringProcessTableSkeleton`; recargas con overlay blur "Loading..." sobre la tabla.
- **Error**: texto destructive centrado.
- **Vacío**: "No interviews yet. Create your first interview to get started." (texto plano, sin ícono ni CTA — mejorable).
- **Borrado**: `DeleteConfirmDialog` nombrando la empresa.

## Notas para el redesign

- Es la pantalla de densidad de información: la marca se juega en badges, tabla y filtros, no en decoración.
- El empty state del dashboard es el más débil de la app (comparar con el del timeline) y es lo primero que ve un usuario nuevo tras registrarse — merece ilustración/CTA.
- Falta hoy (posibles extensiones que el diseño puede contemplar): búsqueda por texto, vista kanban por estado, resumen/stats arriba (la app móvil ya tiene pantalla Stats; web no).
- Terminología inconsistente a unificar con la marca: "Job Applications" / "Hiring Processes" / "interviews" se mezclan en la misma pantalla.
