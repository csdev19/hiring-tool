import { createFileRoute } from "@tanstack/react-router";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => proxyToBackend(request),
      POST: ({ request }) => proxyToBackend(request),
    },
  },
});

async function proxyToBackend(request: Request): Promise<Response> {
  // Extract the path after /api/auth/ from the request URL
  const url = new URL(request.url);
  const authPath = url.pathname.replace(/^\/api\/auth/, "");
  const backendUrl = `${BACKEND_URL}/api/auth${authPath}${url.search}`;

  console.log("Proxying auth request:", request.method, backendUrl);

  // Clone headers but remove host (backend will use its own)
  const headers = new Headers(request.headers);
  headers.delete("host");

  // Forward the request to the backend
  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
  });

  console.log("Backend response status:", response.status);

  // Clone response headers and rewrite Set-Cookie to work on frontend domain
  const responseHeaders = new Headers();

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      // Remove domain attribute so cookie applies to frontend domain
      // Also remove any path restrictions that might cause issues
      const rewrittenCookie = value
        .replace(/;\s*domain=[^;]*/gi, "") // Remove domain
        .replace(/;\s*path=[^;]*/gi, "; Path=/"); // Ensure path is root

      console.log("Rewriting cookie:", value, "->", rewrittenCookie);
      responseHeaders.append(key, rewrittenCookie);
    } else {
      responseHeaders.set(key, value);
    }
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
