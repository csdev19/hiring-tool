import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
      },
    });

    if (!session?.data) {
      throw redirect({ to: "/auth/login" });
    }

    return next({
      context: { session: session.data },
    });
  } catch (error) {
    // If it's already a redirect, rethrow it
    if (error instanceof Response || (error as any)?.redirect) {
      throw error;
    }
    // For any other error (network, API failure), redirect to login
    console.error("Auth middleware error:", error);
    throw redirect({ to: "/auth/login" });
  }
});
