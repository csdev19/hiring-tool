import { createFileRoute } from "@tanstack/react-router";

/**
 * Transforms Set-Cookie headers from backend to work on frontend domain.
 * Removes the Domain attribute so cookies are set on the current (frontend) domain.
 */
function transformSetCookieHeader(setCookie: string): string {
  // Remove Domain attribute so cookie defaults to frontend domain
  // Also ensure Path=/ is set
  let transformed = setCookie
    .split(";")
    .filter((part) => {
      const trimmed = part.trim().toLowerCase();
      // Remove domain attribute - let it default to frontend domain
      return !trimmed.startsWith("domain=");
    })
    .join(";");

  // Ensure Path=/ if not specified
  if (!transformed.toLowerCase().includes("path=")) {
    transformed += "; Path=/";
  }

  return transformed;
}

async function proxyAuthRequest(request: Request): Promise<Response> {
  // Get backend URL from env - use import.meta.env which is inlined at build time
  const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

  if (!BACKEND_URL) {
    console.error("VITE_SERVER_URL is not configured");
    return new Response(
      JSON.stringify({
        error: "Server configuration error",
        message: "Backend URL not configured",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Get the remaining path after /api/auth/
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/api/auth/")[1] || "";

  // Construct the backend URL
  const backendUrl = `${BACKEND_URL}/api/auth/${pathSegments}${url.search}`;

  // Forward all headers except host
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  }

  // Create the proxied request
  const proxyRequest = new Request(backendUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
  });

  try {
    // Forward request to backend
    const backendResponse = await fetch(proxyRequest);

    // Create response with backend data
    const responseHeaders = new Headers();

    // Forward all headers from backend, but transform Set-Cookie headers
    for (const [key, value] of backendResponse.headers.entries()) {
      if (key.toLowerCase() === "set-cookie") {
        // Transform cookie to work on frontend domain
        responseHeaders.append(key, transformSetCookieHeader(value));
      } else {
        responseHeaders.set(key, value);
      }
    }

    // Get the response body
    const body = await backendResponse.text();

    // Return proxied response
    return new Response(body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Auth proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to connect to authentication server",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return proxyAuthRequest(request);
      },
      POST: async ({ request }) => {
        return proxyAuthRequest(request);
      },
      PUT: async ({ request }) => {
        return proxyAuthRequest(request);
      },
      PATCH: async ({ request }) => {
        return proxyAuthRequest(request);
      },
      DELETE: async ({ request }) => {
        return proxyAuthRequest(request);
      },
    },
  },
});
