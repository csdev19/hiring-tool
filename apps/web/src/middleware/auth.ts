import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
        signal: AbortSignal.timeout(3000), // 5 second timeout
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

    // Check if it's an AbortError (timeout) or network error
    const isNetworkError =
      error instanceof TypeError || // Network errors
      error instanceof DOMException || // AbortError
      (error as any)?.name === "AbortError" ||
      (error as any)?.message?.includes("fetch") ||
      (error as any)?.message?.includes("network");

    if (isNetworkError) {
      // Log the error but don't redirect - allow the request to proceed
      // The client-side will handle auth if needed
      console.error("Auth middleware network error (allowing request):", error);

      // Option 1: Allow request through without session (client will handle)
      // return next({
      //   context: { session: undefined },
      // });
      throw redirect({ to: "/auth/login" });
    }

    // For any other error (network, API failure), redirect to login
    console.error("Auth middleware error:", error);
    throw redirect({ to: "/auth/login" });
  }
});
