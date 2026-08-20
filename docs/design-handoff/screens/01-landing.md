# Pantalla: Landing (pública)

**Ruta**: `/` — `apps/web/src/routes/index.tsx`
**Acceso**: pública; cambia CTAs según sesión.

## Propósito

Vender el producto en una pasada y llevar a signup (o al dashboard si ya hay sesión).

## Estructura actual (top → bottom)

1. **Header global fijo** (compartido en toda la web, `components/header.tsx`): logo texto "Hiring Tool" + link "Dashboard" (si autenticado) a la izquierda; UserMenu o botón "Sign In" a la derecha.
2. **Hero**: H1 "Track Your Job Applications / All in One Place" (segunda línea en color primary), párrafo descriptivo, y CTAs:
   - Sin sesión: "Get Started →" (primary) + "Sign In" (outline).
   - Con sesión: "Go to Dashboard →".
3. **Features grid**: título "Everything You Need to Manage Your Job Search" + 6 cards (ícono lucide en tile `bg-primary/10` + título + párrafo):
   - Application Tracking (Briefcase) — estados ongoing/rejected/dropped-out/hired.
   - Company Details (Building2) — salario, beneficios, ubicación, contactos.
   - Interaction History (MessageSquare) — registrar cada comunicación.
   - Pipeline Management (TrendingUp) — visualizar el pipeline por etapas.
   - Status Updates (CheckCircle2) — actualizar estados de un vistazo.
   - Centralized Dashboard (Briefcase, ícono repetido) — dashboard con búsqueda y filtros.
4. **CTA final**: card centrada con título/copy condicionales por sesión + botón grande.
5. **Footer**: una línea, "Hiring Tool - Manage your job applications with ease".

## Detalles visuales actuales

- Fondo con gradiente sutil `from-background to-muted/20`.
- Todo tipografía del sistema, sin imágenes, sin ilustraciones, sin screenshot del producto.

## Notas para el redesign

- Es la pantalla con más libertad creativa: hoy es 100% genérica ("podría ser cualquier SaaS").
- Falta mostrar el producto (screenshot/mock del dashboard o del timeline).
- El feature grid repite ícono y solapa conceptos (Application Tracking ≈ Status Updates ≈ Centralized Dashboard); con la marca definida se puede reducir a 3–4 features reales: pipeline de estados, datos de compensación, timeline de interacciones.
- Aquí nacerá el tagline nuevo (ver `../01-brand-brief.md`).
