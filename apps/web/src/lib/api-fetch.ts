/**
 * Fetch wrapper that uses Cloudflare Service Bindings in production
 * and falls back to regular fetch() in local development.
 *
 * Service Bindings allow direct Worker-to-Worker communication
 * without going through public DNS (which breaks on *.workers.dev).
 */
export async function apiFetch(request: Request | string, init?: RequestInit): Promise<Response> {
  try {
    // In Cloudflare Workers, "cloudflare:workers" provides access to bindings
    const { env } = await import("cloudflare:workers");
    if (env.API_SERVICE) {
      console.log("[apiFetch] Using Service Binding (API_SERVICE)");
      const req = typeof request === "string" ? new Request(request, init) : request;
      return env.API_SERVICE.fetch(req);
    }
    console.log("[apiFetch] API_SERVICE binding not found, falling back to fetch()");
  } catch (error) {
    console.log(
      "[apiFetch] cloudflare:workers not available, using regular fetch()",
      error instanceof Error ? error.message : error,
    );
  }

  return fetch(request, init);
}
