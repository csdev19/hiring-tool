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
  try {
    const url = new URL(request.url);
    const targetUrl = `${env.VITE_SERVER_URL}${url.pathname}${url.search}`;
    console.log("[proxy] 1. Target URL:", targetUrl);
    console.log("[proxy] 2. Method:", request.method);

    const headers = new Headers();
    headers.set("cookie", request.headers.get("cookie") ?? "");
    headers.set("content-type", request.headers.get("content-type") ?? "application/json");
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", url.protocol.replace(":", ""));

    const origin = request.headers.get("origin");
    if (origin) headers.set("origin", origin);
    const referer = request.headers.get("referer");
    if (referer) headers.set("referer", referer);

    console.log("[proxy] 3. Headers built:", Object.fromEntries(headers.entries()));

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    let body: string | undefined;
    if (hasBody) {
      body = await request.text();
      console.log("[proxy] 4. Body read, length:", body.length);
    } else {
      console.log("[proxy] 4. No body (GET/HEAD)");
    }

    console.log("[proxy] 5. Sending fetch...");
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });
    console.log("[proxy] 6. Fetch completed, status:", response.status);

    const responseHeaders = new Headers(response.headers);

    const setCookies = response.headers.getSetCookie?.() ?? [];
    console.log("[proxy] 7. Set-Cookie count:", setCookies.length);
    if (setCookies.length > 0) {
      responseHeaders.delete("set-cookie");
      for (const cookie of setCookies) {
        const rewritten = cookie.replace(/;\s*domain=[^;]*/gi, "");
        responseHeaders.append("set-cookie", rewritten);
      }
    }

    console.log("[proxy] 8. Returning response");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[proxy] ERROR:", error instanceof Error ? error.message : error);
    console.error("[proxy] ERROR stack:", error instanceof Error ? error.stack : "no stack");
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
