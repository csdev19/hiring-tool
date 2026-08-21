# Pantallas: Login y Signup

**Rutas**: `/auth/login`, `/auth/signup` — `apps/web/src/routes/auth/*.tsx`, forms en `components/sign-in-form.tsx` y `sign-up-form.tsx`
**Acceso**: solo sin sesión (con sesión redirige a `/hiring-processes`).

## Propósito

Autenticación email + password vía Better Auth. Sin OAuth ni magic links por ahora.

## Estructura actual

Ambas son una columna centrada `max-w-md` bajo el header global — sin card, sin fondo propio, sin marca:

### Login

- H1 "Welcome Back" centrado.
- Campos: Email, Password (validación zod: email válido, password ≥ 8 chars; errores en texto `text-red-500` — nota: no usa el token `destructive`).
- Botón full-width "Sign In" (deshabilitado mientras no puede enviar; "Submitting..." al enviar).
- Link inferior: "Need an account? **Sign Up**".

### Signup

- Igual estructura con campo extra Nombre.
- Link inferior: "Already have an account? **Sign In**".

## Feedback

- Toast de éxito ("Sign in successful") y navegación a `/hiring-processes`.
- Toast de error con el mensaje del backend.

## Notas para el redesign

- Es la primera pantalla "propia" que ve un usuario nuevo: hoy no comunica nada de marca. Candidata a layout split (marca/ilustración + form) o card con logo.
- Unificar el color de error con el token `destructive`.
- Considerar copy de bienvenida alineado a la filosofía (ej. tono de "empieza a tomar control de tu búsqueda").
