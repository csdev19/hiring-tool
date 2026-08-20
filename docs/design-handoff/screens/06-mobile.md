# App móvil (Expo / React Native)

**Ubicación**: `apps/mobile/app/` (expo-router). Companion app de solo consulta rápida + alta simple. Solo importa de `@interviews-tool/domain` (regla del monorepo).

## Estado general

Funcional pero visualmente heredada del template de Expo: primary hardcodeado `#0a7ea4` (el azul de Expo, no tiene nada que ver con la web), fondo dark fijo en varias pantallas, `ThemedText`/`ThemedView` del starter, Alerts nativos para errores. **Cero conexión visual con la web** — es la plataforma que más necesita los tokens de la nueva identidad.

## Pantallas

### Auth: Sign In / Sign Up — `(auth)/sign-in.tsx`, `sign-up.tsx`
Formularios simples email+password (signup agrega nombre), botón primary, link cruzado entre ambas. Errores por `Alert.alert`.

### Tab 1 — Home / "My Hirings" — `(tabs)/index.tsx`
- Header: título "My Hirings" + botón circular "＋" (→ crear).
- Lista infinita (FlatList + infinite query, "Load More" manual como fallback, contador "Showing X of Y processes").
- Card por proceso: empresa + badge de estado (color sólido desde `HIRING_PROCESS_STATUS_INFO.color`, texto blanco), puesto, salario en verde `#22c55e` (`USD 4,500 / monthly`).
- Estados: loading spinner, error con Retry, empty ("No hiring processes yet / Start tracking your job applications!").

### Tab 2 — Stats — `(tabs)/stats.tsx`
**Solo existe en móvil, no en web.**
- 3 summary cards: Total / Active (azul) / Closed (gris) — usa la categoría active/terminal del dominio.
- Card "By Status": fila por estado con dot del color del dominio + label + count (solo estados con count > 0).

### Tab 3 — Profile — `(tabs)/profile.tsx`
Card con nombre + email de la sesión y botón Sign Out.

### Detalle — `hiring/[id].tsx`
Solo lectura, datos pasados por params de navegación (no re-fetch): empresa, puesto, badge de estado, y card Details con filas label/valor (Salary, Created, Updated). **No muestra interacciones ni company details** — gap funcional respecto a web.

### Crear — `hiring/create.tsx`
Form de alta con los campos principales (empresa*, puesto, estado, salario/moneda/tarifa — pickers propios), validado con el schema zod compartido del dominio. Sin sección de company details. Al crear vuelve atrás e invalida la lista.

## Notas para el redesign

1. Reemplazar `#0a7ea4` y el theming del starter por los tokens de la nueva marca (compartir los hex de estado del dominio ya es el patrón correcto: móvil los usa, web los duplica).
2. Los badges móviles usan color sólido + texto blanco; web usa tinte suave + texto oscuro. Decidir un solo tratamiento de badge para toda la marca.
3. Stats es la semilla de un futuro dashboard analítico — considerar su versión web en el redesign.
4. App icon y splash screen serán la primera aplicación del logo nuevo.
