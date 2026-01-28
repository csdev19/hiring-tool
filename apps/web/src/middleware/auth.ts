import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const cookie = headers.get("cookie");

  console.log("auth middleware ------>");
  console.log("Cookie header:", cookie ? "present" : "NO COOKIE");

  if (!cookie) {
    console.log("No cookie found, redirecting to login");
    throw redirect({ to: "/auth/login" });
  }

  try {
    // Fetch session directly from backend with the cookie
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      method: "GET",
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Session fetch failed:", response.status);
      throw redirect({ to: "/auth/login" });
    }

    const session: Session | null = await response.json();

    console.log("Session result:", session ? "valid" : "null");

    if (!session) {
      throw redirect({ to: "/auth/login" });
    }

    return next({
      context: { session },
    });
  } catch (error) {
    // If it's already a redirect, rethrow it
    if (error instanceof Response || (error as any)?.redirect) {
      throw error;
    }

    console.error("Auth middleware error:", error);
    throw redirect({ to: "/auth/login" });
  }
});
