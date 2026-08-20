# Product Overview — Hiring Tool

## Qué es

Un tracker personal de búsqueda de trabajo. El usuario (un candidato, no una empresa) registra cada proceso de contratación en el que participa —empresa, puesto, salario, estado— y documenta cada interacción del proceso (emails, llamadas, entrevistas, retos técnicos, ofertas) en un timeline con notas en Markdown.

**La perspectiva es la del candidato**: no es un ATS para reclutadores, es la herramienta del otro lado de la mesa. El "pipeline" es *mi* pipeline de oportunidades.

## Para quién

- Personas en búsqueda activa de trabajo, especialmente en tech (los placeholders sugieren "Frontend Developer", "React Native Developer", "DevOps Engineer").
- Gente que maneja varios procesos en paralelo y pierde el hilo: ¿qué me dijeron en la segunda entrevista de X? ¿cuánto ofrecía Y? ¿quién era mi contacto en Z?
- El usuario tipo valora datos concretos: salario declarado o no, moneda (USD / PEN), tarifa mensual o por hora, número de pasos del proceso.

## El problema que resuelve

Una búsqueda de trabajo seria son 10–30 procesos simultáneos, cada uno con su propio estado, contactos y conversaciones. Eso hoy vive disperso entre email, LinkedIn, notas sueltas y memoria. La app centraliza:

1. **Estado de cada proceso** — un pipeline de 8 estados con transiciones válidas.
2. **Datos duros** — salario, moneda, tipo de tarifa, beneficios, ubicación, sitio web, persona de contacto, canal de contacto, número de etapas.
3. **Memoria de la conversación** — timeline de interacciones con contenido Markdown. El empty state lo dice literal: *"It will help future you remember why this mattered."*

## Modelo de datos (conceptual)

```
User
 └── HiringProcess (proceso de contratación con una empresa)
      ├── companyName (requerido)
      ├── jobTitle (opcional)
      ├── status (8 estados, ver abajo)
      ├── salary + currency (USD/PEN) + salaryRateType (monthly/hourly)
      ├── CompanyDetails (opcional, 1:1)
      │    ├── website, location, benefits (texto libre)
      │    ├── contactedVia (LinkedIn / Email / Facebook / Other)
      │    ├── contactPerson
      │    └── interviewSteps (número de etapas del proceso)
      └── Interaction[] (timeline)
           ├── type (10 tipos, ver abajo)
           ├── title (opcional)
           ├── content (Markdown, 10–10.000 chars)
           └── createdAt
```

## Los 8 estados del proceso

Definidos en `packages/domain/src/constants/hiring-process-status.ts`, con orden, categoría (active/terminal), color y transiciones válidas:

| Estado | Label | Categoría | Color actual | Significado |
| --- | --- | --- | --- | --- |
| `first-contact` | First Contact | active | `#8b5cf6` violeta | Outreach inicial (LinkedIn, email…) |
| `ongoing` | Ongoing | active | `#3b82f6` azul | Proceso de entrevistas activo |
| `on-hold` | On Hold | active | `#f59e0b` ámbar | Proceso frío / sin novedades |
| `offer-made` | Offer Made | active | `#06b6d4` cian | La empresa hizo oferta |
| `offer-accepted` | Offer Accepted | terminal | `#10b981` esmeralda | Oferta aceptada |
| `hired` | Hired | terminal | `#22c55e` verde | Contratado |
| `rejected` | Rejected | terminal | `#ef4444` rojo | Rechazado |
| `dropped-out` | Dropped Out | terminal | `#6b7280` gris | El candidato se retiró |

Hay una máquina de estados (`STATUS_TRANSITIONS`) que define transiciones válidas; los estados terminales no transicionan. Estado por defecto al crear: `first-contact`.

## Los 10 tipos de interacción

`email`, `phone-call`, `video-call`, `in-person-meeting`, `technical-challenge`, `application`, `offer`, `rejection`, `follow-up`, `note`. Cada uno tiene ícono (lucide) y variante de badge. `note` es el default.

## Flujos principales

1. **Onboarding**: Landing → Signup (nombre, email, password) → Dashboard.
2. **Registrar proceso**: Dashboard → "Create Job Application" → formulario (empresa, puesto, estado, salario + sección colapsable de company details) → detalle del proceso.
3. **Documentar el día a día** (el corazón del producto): Detalle del proceso → form de nueva interacción (sticky, columna izquierda) → la interacción aparece en el timeline (columna derecha). Editar/borrar interacciones vía diálogos.
4. **Revisar el pipeline**: Dashboard con tabla paginada y ordenable, filtros por estado (multi-select) y por salario (declarado / no declarado / rango min–max).
5. **Móvil (companion)**: lista infinita de procesos, stats (total / activos / cerrados + desglose por estado), detalle de solo lectura, crear proceso, perfil.

## Plataformas y stack (contexto técnico)

- **Web**: TanStack Router/Query/Form + React, Tailwind CSS 4, componentes propios en `@interviews-tool/web-ui` (estilo shadcn), lucide-react, sonner (toasts), `@uiw/react-md-editor`. Soporta dark mode por clases.
- **Mobile**: Expo / React Native con expo-router, tabs (Home, Stats, Profile).
- **Backend**: Hono en Cloudflare Workers, Better Auth (email+password), Drizzle/Prisma sobre Neon Postgres.
- Monorepo DDD/hexagonal: `domain` → `application` → `infra-*` → `apps`.

## Nombre actual (provisional)

"Hiring Tool" / paquetes `@interviews-tool/*`. Es un placeholder: genérico, del lado equivocado (suena a herramienta de empresa que contrata) y sin identidad. Ver `01-brand-brief.md`.
