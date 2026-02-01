/**
 * Server-side auth utilities for TanStack Start
 * Use these in loaders, actions, and server handlers
 */

export async function getSession(request: Request) {
  const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

  if (!BACKEND_URL) {
    console.error("VITE_SERVER_URL is not configured");
    return null;
  }

  try {
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookies,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function requireAuth(request: Request) {
  const session = await getSession(request);

  if (!session?.user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return session;
}
