import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env/server";

/**
 * Proxy handler that forwards auth requests to the backend API.
 *
 * Responsibilities:
 * 1. Forward the request to the real backend
 * 2. Forward relevant headers (cookie, content-type, etc.)
 * 3. Rewrite Set-Cookie headers to remove the backend domain
 *    so cookies are assigned to the client domain
 */
async function proxyToBackend(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = `${env.VITE_SERVER_URL}${url.pathname}${url.search}`;
  console.log("Proxying auth request to backend:", targetUrl);

  const headers = new Headers();
  headers.set("cookie", request.headers.get("cookie") ?? "");
  headers.set("content-type", request.headers.get("content-type") ?? "application/json");
  headers.set("x-forwarded-host", url.host);
  headers.set("x-forwarded-proto", url.protocol.replace(":", ""));

  // Forward origin and referer for Better Auth CSRF validation
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

  // Rewrite Set-Cookie headers: remove backend domain so the browser
  // assigns cookies to the client domain instead
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
