import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

interface SessionData {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  session: {
    id: string;
    expiresAt: string;
  };
}

/**
 * Fetch session directly from backend (server-side only)
 * This avoids issues with authClient's relative URL in SSR context
 */
async function getSessionFromBackend(
  cookies: string,
  signal?: AbortSignal,
): Promise<SessionData | null> {
  const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

  if (!BACKEND_URL) {
    console.error("VITE_SERVER_URL is not configured");
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: { cookie: cookies },
      signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.user ? data : null;
  } catch (error) {
    // Don't log abort errors as they're expected on timeout
    if ((error as Error)?.name !== "AbortError") {
      console.error("Failed to fetch session:", error);
    }
    return null;
  }
}

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const cookies = request.headers.get("cookie") || "";
    const session = await getSessionFromBackend(cookies, controller.signal);

    clearTimeout(timeoutId);

    if (!session?.user) {
      throw redirect({ to: "/auth/login" });
    }

    return next({
      context: { session },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    // If it's already a redirect, rethrow it
    if (error instanceof Response || (error as any)?.redirect) {
      throw error;
    }

    // In production, allow graceful degradation for network errors
    if (import.meta.env.PROD && (error as Error)?.name === "AbortError") {
      return next({ context: { session: undefined } });
    }

    console.error("Auth middleware error:", error);
    throw redirect({ to: "/auth/login" });
  }
});
