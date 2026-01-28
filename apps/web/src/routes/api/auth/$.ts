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

  // Clone headers but remove host
  const headers = new Headers(request.headers);
  headers.delete("host");

  // Forward the request to the backend
  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
  });

  console.log("Backend response status:", response.status);

  // Return the response with all headers (including Set-Cookie)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
