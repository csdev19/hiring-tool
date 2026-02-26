# Cross-Origin Auth Proxy: Estado Actual y Problema

## Contexto del Proyecto

Monorepo con dos apps desplegadas como Cloudflare Workers:

- **Web (SSR):** `hiring-tool-web.cristiansotomayor-dev.workers.dev` — TanStack Start (React SSR)
- **API Backend:** `hiring-tool-api.cristiansotomayor-dev.workers.dev` — Elysia.js + Better Auth

Ambos comparten la misma base de datos PostgreSQL (Neon).

---

## Problema Original

Las cookies de autenticacion (Better Auth) se setean en el dominio del backend. Como el frontend SSR vive en otro dominio, no puede leer esas cookies durante el server-side rendering para generar contenido basado en la sesion del usuario.

---

## Solucion Implementada: Proxy Pattern

El cliente web actua como proxy de las rutas de auth. Las cookies se reescriben para que vivan en el dominio del cliente.

### Flujo

```
Browser
  -> hiring-tool-web.workers.dev/api/auth/*   (proxy route en el web Worker)
    -> hiring-tool-api.workers.dev/api/auth/* (backend real)
      <- Set-Cookie (reescrita: se elimina el domain del backend)
  <- Cookie queda en el dominio del web Worker
```

### Cambios Realizados

#### 1. Eliminamos Better Auth del web Worker

**Antes:** El web Worker tenia su propia instancia de Better Auth conectada directamente a la DB.

**Despues:** El web Worker ya no ejecuta Better Auth. Solo actua como proxy hacia el backend.

**Archivos eliminados:**

- `apps/web/src/lib/auth/auth-server.ts` — instancia local de Better Auth (eliminada)

**Dependencias removidas:**

- `@interviews-tool/infra-auth` removida de `apps/web/package.json`

#### 2. Ruta proxy `/api/auth/$`

**Archivo:** `apps/web/src/routes/api/auth/$.ts`

**Antes:**

```ts
import { auth } from "@/lib/auth/auth-server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => auth.handler(request),
      POST: async ({ request }) => auth.handler(request),
      // ...
    },
  },
});
```

**Despues:**

```ts
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env/server";

async function proxyToBackend(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const targetUrl = `${env.VITE_SERVER_URL}${url.pathname}${url.search}`;

    const headers = new Headers();
    headers.set("cookie", request.headers.get("cookie") ?? "");
    headers.set("content-type", request.headers.get("content-type") ?? "application/json");
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", url.protocol.replace(":", ""));

    // Forward origin y referer para CSRF de Better Auth
    const origin = request.headers.get("origin");
    if (origin) headers.set("origin", origin);
    const referer = request.headers.get("referer");
    if (referer) headers.set("referer", referer);

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.text() : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseHeaders = new Headers(response.headers);

    // Reescribir Set-Cookie: eliminar domain del backend
    const setCookies = response.headers.getSetCookie?.() ?? [];
    if (setCookies.length > 0) {
      responseHeaders.delete("set-cookie");
      for (const cookie of setCookies) {
        const rewritten = cookie.replace(/;\s*domain=[^;]*/gi, "");
        responseHeaders.append("set-cookie", rewritten);
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[proxy] ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => proxyToBackend(request),
      POST: async ({ request }) => proxyToBackend(request),
      PUT: async ({ request }) => proxyToBackend(request),
      PATCH: async ({ request }) => proxyToBackend(request),
      DELETE: async ({ request }) => proxyToBackend(request),
    },
  },
});
```

#### 3. `getAuthSession` — fetch al backend en vez de llamada local

**Archivo:** `apps/web/src/lib/auth/get-auth-session.ts`

**Antes:**

```ts
import { auth } from "./auth-server";

const headers = getRequestHeaders();
const session = await auth.api.getSession({ headers });
```

**Despues:**

```ts
import { env } from "@/env/server";

const headers = getRequestHeaders();
const cookie = headers.get("cookie") ?? "";

const response = await fetch(`${env.VITE_SERVER_URL}/api/auth/get-session`, {
  headers: { cookie },
});

const data = await response.json();
return data as AuthSession;
```

#### 4. Variables de entorno simplificadas

**Antes** (web server env):

```ts
export const webServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: commaSeparatedList,
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().min(1),
});
```

**Despues:**

```ts
export const webServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: commaSeparatedList,
  VITE_SERVER_URL: z.string().min(1),
});
```

`VITE_SERVER_URL` se usa tanto en el cliente (Treaty API calls) como en el servidor (proxy + session fetch). Una sola variable, un solo valor.

#### 5. Deploy workflow actualizado

**Archivo:** `.github/workflows/deploy-production.yml`

Se removio `BETTER_AUTH_SECRET` del build y deploy del frontend. Ya no es necesario porque el web Worker no ejecuta Better Auth.

---

## Que Funciona

- **Local (localhost):** Todo funciona. El proxy hace `fetch("http://localhost:3000/api/auth/...")` y no hay restricciones.
- **Backend directo:** Desde Bruno/Postman, `POST https://hiring-tool-api.cristiansotomayor-dev.workers.dev/api/auth/sign-in/email` retorna 200 OK con sesion y token.
- **Build:** Compila sin errores.

---

## Que NO Funciona: Cloudflare Workers

### El error

Cuando el web Worker (desplegado en Cloudflare) intenta hacer `fetch()` al API Worker, obtenemos:

- **Error 1042** — Error interno de Cloudflare Workers
- **404** — La ruta no se encuentra

### Logs del proxy en Cloudflare

```
[proxy] 1. Target URL: https://hiring-tool-api.cristiansotomayor-dev.workers.dev/api/auth/sign-in/email
[proxy] 2. Method: POST
[proxy] 3. Headers built: {...}
[proxy] 4. Body read, length: 52
[proxy] 5. Sending fetch...
[proxy] 6. Fetch completed, status: 404    <-- ACA FALLA
[proxy] 7. Set-Cookie count: 0
[proxy] 8. Returning response
```

El `fetch()` se ejecuta (no lanza excepcion), pero el backend responde 404. Sin embargo, la misma URL desde Bruno retorna 200.

### Causa raiz

**Cloudflare no permite que un Worker haga `fetch()` a otro Worker en el mismo dominio `*.workers.dev`.** Es una limitacion conocida de la plataforma. El routing interno de Cloudflare no resuelve correctamente Worker-to-Worker requests en subdominios de `workers.dev`.

Referencia: https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/

---

## Solucion Propuesta: Cloudflare Service Bindings

En vez de hacer `fetch()` por HTTP publico, usar Service Bindings para comunicacion directa Worker-to-Worker dentro de la red de Cloudflare.

### Como funciona

```
Browser
  -> hiring-tool-web Worker (proxy route)
    -> [Service Binding: env.API_SERVICE.fetch()] -> hiring-tool-api Worker
      <- Response directa (mismo servidor, mismo thread)
    <- Set-Cookie reescrita
  <- Cookie en dominio del cliente
```

### Cambios necesarios

#### 1. Configurar el binding en `apps/web/wrangler.jsonc`

```jsonc
{
  "services": [
    {
      "binding": "API_SERVICE",
      "service": "hiring-tool-api"
    }
  ]
}
```

#### 2. Modificar el proxy para usar el binding

```ts
// En vez de:
const response = await fetch(targetUrl, { method, headers, body });

// Usar:
const targetRequest = new Request(targetUrl, { method, headers, body });
const response = await env.API_SERVICE.fetch(targetRequest);
```

`env.API_SERVICE` es un `Fetcher` — tiene la misma API de `fetch()` pero rutea internamente.

#### 3. TypeScript types

```ts
interface Env {
  API_SERVICE: Fetcher; // Cloudflare Service Binding
}
```

### Consideraciones

- **Zero latency:** Ambos Workers corren en el mismo thread del mismo servidor.
- **Sin costo extra:** Las llamadas via Service Binding no cuentan como invocaciones separadas.
- **Limite:** Maximo 32 invocaciones de Worker por request.
- **Dev local:** En desarrollo local se puede usar `fetch()` normal con `localhost` ya que no hay restriccion. O usar `wrangler dev` con multiples configs para simular bindings.

### Preguntas abiertas

1. **Como acceder a `env.API_SERVICE` desde una ruta de TanStack Start?** Los handlers reciben `{ request }` pero no `env`. Hay que investigar como TanStack Start + Cloudflare plugin exponen los bindings del Worker.

2. **Fallback para dev local:** Necesitamos que en desarrollo (sin bindings) use `fetch()` normal, y en produccion (con bindings) use `env.API_SERVICE.fetch()`. Posible solucion: detectar si el binding existe.

3. **`getAuthSession` tambien necesita el binding**, no solo la ruta proxy. Ambos hacen `fetch()` al backend.

---

## Archivos Relevantes

| Archivo                                         | Proposito                                                 |
| ----------------------------------------------- | --------------------------------------------------------- |
| `apps/web/src/routes/api/auth/$.ts`             | Proxy route (aqui esta el `fetch()` que falla)            |
| `apps/web/src/lib/auth/get-auth-session.ts`     | Server function que lee sesion del backend                |
| `apps/web/src/lib/auth/auth-client.ts`          | Auth client del browser (sin cambios, usa relative paths) |
| `apps/web/src/lib/auth/types.ts`                | Tipos de AuthSession (sin cambios)                        |
| `packages/infra-env/src/web-server.ts`          | Schema de env vars del web server                         |
| `apps/server/src/index.ts`                      | Entry point del API (monta Better Auth en `/`)            |
| `apps/server/src/lib/auth.ts`                   | Instancia de Better Auth del backend                      |
| `packages/infra-auth/src/config/base-config.ts` | Config compartida de Better Auth                          |
| `.github/workflows/deploy-production.yml`       | CI/CD deploy                                              |
| `apps/web/wrangler.jsonc`                       | Config de Cloudflare Worker del web                       |
| `apps/server/wrangler.jsonc`                    | Config de Cloudflare Worker del API                       |

---

## Alternativas Descartadas

### A. Custom domain para el API

Poner el API detras de un dominio custom (e.g., `api.tudominio.com`). El routing DNS externo funciona normalmente para Worker-to-Worker. Descartada por requerir configuracion DNS adicional.

### C. Mantener la arquitectura original

No hacer proxy — mantener Better Auth corriendo en ambos Workers (web y API). Ambos conectan a la misma DB asi que las sesiones se comparten. Las cookies con `sameSite: "none"` permiten cross-origin. Descartada porque queremos eliminar la dependencia de DB directa para auth en el web Worker.
