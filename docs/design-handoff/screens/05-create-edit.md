# Pantallas: Crear y Editar proceso

**Rutas**: `/hiring-processes/new` y `/hiring-processes/$id/edit` — `routes/_authenticated/hiring-processes/new.tsx` y `$id_.edit.tsx`
**Componente compartido**: `components/hiring-process/hiring-process-form.tsx` (TanStack Form, dos forms internos: proceso + company details)

## Propósito

Alta y edición de un proceso. Misma UI en ambos; edit precarga valores y decide create-vs-update de los company details.

## Estructura actual

Columna centrada `max-w-2xl`:

1. **Page header**: "Create New Hiring Process" / "Edit Hiring Process" + subtítulo (en edit menciona la empresa).
2. **Card "Hiring Process Details"** con el formulario:

### Campos principales
| Campo | Tipo | Notas |
| --- | --- | --- |
| Company Name * | Input | único requerido; error inline |
| Job Title | Input | placeholder con ejemplos tech |
| Status * | `<select>` nativo | 8 estados ordenados por `order`; default First Contact |
| Salary + rate + currency | fila de 3 controles | Input numérico (máx 25.000) + select Monthly/Hourly + select USD/PEN; el label cambia según tarifa ("Monthly Salary" / "Hourly Rate") |

### Sección colapsable "Company Details (Optional)"
Toggle con chevron (se auto-abre en edit si hay website/location):
- Website (url), Location ("City, Country"), Benefits (textarea 3 filas), Contacted Via (select: LinkedIn/Email/Facebook/Other), Contact Person ("@username or name"), Hiring Process Steps (número).
- Solo se envía si al menos un campo tiene valor.

3. **Footer**: Cancel (outline) + submit primary ("Create Hiring Process" / "Update Hiring Process"; "Saving..." al enviar).

## Flujo tras enviar

- Create: crea proceso → crea company details (si falla, no rompe el alta) → toast → navega al detalle.
- Edit: actualiza proceso → crea o actualiza company details → toast → navega al detalle.
- Cancel: create vuelve a la lista; edit vuelve al detalle.
- Edit tiene skeleton, error y not-found propios.

## Notas para el redesign

- Los `<select>` nativos con clases manuales rompen la consistencia con el `Select` del design system — unificar.
- La fila salario/tarifa/moneda es el grupo más denso; buena candidata a un control compuesto bien diseñado (es el dato estrella del producto).
- El form es corto a propósito (solo empresa es requerida): el diseño debe reforzar "registrar un proceso toma 10 segundos".
