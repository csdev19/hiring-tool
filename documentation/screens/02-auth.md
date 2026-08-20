# Brief: Login / Signup

**Rutas**: `/auth/login`, `/auth/signup`. Email + password (Better Auth); signup agrega nombre. Con sesión redirigen al dashboard.

## Función (se conserva)

- Login: email + password (zod: email válido, password ≥8), submit full-width, link cruzado a signup.
- Signup: + campo nombre, link cruzado a login.
- Toast de éxito y navegación al dashboard; toast de error con mensaje del backend.

## Directivas Tapuy

- Primera pantalla "propia" que ve un usuario: aquí se presenta la marca. Columna centrada sobre `bg` con el **lockup** (símbolo + "tapuy") arriba del form; opcionalmente el tagline *Ask. Listen. Remember.* en `text-secondary`. No hace falta split-screen ni ilustración: la sobriedad es la marca.
- Card del form sobre `surface` (o form directo sobre `bg` con inputs `surface-2`); un solo botón primario (submit).
- Errores inline en danger (`#E05252` dark), no `text-red-500` genérico. Error de email duplicado con el copy canónico: *That email's already registered. Sign in instead.* (con link).
- Focus ring menta = el acento de la vista.
- Sin exclamaciones, sin "Welcome back!" con signo.

## Copy actual → nuevo

- "Welcome Back" → **Sign in** como h1 (o "Welcome back" sin exclamación como subtítulo; el h1 nombra la acción).
- Signup h1 → **Create your account**.
- "Need an account? Sign Up" → **No account? Create one**.
- "Already have an account? Sign In" → **Already have an account? Sign in**.
- Submit: **Sign in** / **Create account**; enviando: **Signing in…** / **Creating account…**.
- Toast éxito login: `Signed in` (o ninguno — la navegación ya lo comunica).
