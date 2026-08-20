# Brief: App móvil (Expo)

**Ubicación**: `apps/mobile/app/`. Companion de consulta rápida + alta simple. Hoy usa el theming del template de Expo (`#0a7ea4`, fondo dark fijo) — se reemplaza completo por los tokens Tapuy.

## Pantallas y función (se conserva)

- **Auth** (sign-in / sign-up): email+password, signup con nombre.
- **Tab Home**: lista infinita de procesos; card por proceso (empresa + badge + puesto + salario). Botón de crear.
- **Tab Stats** (solo móvil): 3 summary cards (Total / Active / Closed) + desglose por estado con dot de color y count.
- **Tab Profile**: nombre + email + sign out.
- **Detalle** (`hiring/[id]`): solo lectura — empresa, puesto, badge, filas Salary/Created/Updated.
- **Crear** (`hiring/create`): empresa*, puesto, estado, salario/moneda/tarifa; validación zod compartida del dominio.

## Directivas Tapuy

- **Mismos tokens que web**: fondo `#0A0F14`, surfaces `#0F161D`/`#141C25`, texto `#E6EBF0`, acento menta. Fuera el `#0a7ea4` y el verde suelto del salario. Dark default; light sigue el sistema.
- **Badges de estado idénticos a web**: activos tintados con borde, terminales sólidos. Los colores vienen de `HIRING_PROCESS_STATUS_META` del dominio (dark/light por plataforma) — móvil ya lee del dominio, ese es el patrón correcto.
- Salarios y cifras en **Geist Mono** con tabular-nums (cards de Home, filas del detalle, números de Stats).
- **Stats**: los summary numbers en mono grandes; el desglose con dots usando el color de texto del badge de cada estado. Sin neón en gráficos/barras — regla explícita del sistema.
- Botón crear (el "＋" circular) = único elemento menta de la pantalla Home.
- Tab bar: ítem activo en menta (label ≤14px, cumple la regla), inactivos `text-muted`.
- **App icon**: fondo `#0A0F14`, símbolo (arco + punto menta) centrado al 60% del canvas, sin borde. **Splash**: fondo `#0A0F14` + símbolo; opcional *Ask. Listen. Remember.* debajo en `text-secondary`.
- Errores dejan de ser `Alert.alert` nativo cuando sea razonable → toast/inline con la voz de marca.

## Copy actual → nuevo

- "My Hirings" → **Your processes** (misma terminología que web: process).
- "No hiring processes yet / Start tracking your job applications!" → empty canónico: **Your pipeline starts here** / *Add the first company you're talking to.* (sin exclamaciones).
- "Showing X of Y processes" → en Geist Mono, `text-muted`.
- "Stats" se queda; "Closed" se queda (coincide con la categoría terminal).

## Gaps funcionales anotados (no diseñar ahora, no bloquean)

- El detalle móvil no muestra interacciones ni company details (web sí). El rediseño puede dejar el espacio previsto para el timeline futuro.
- Stats no existe en web; su versión web queda para más adelante.
