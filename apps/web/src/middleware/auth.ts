import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: request.headers,
      throw: true,
    },
  });

  if (!session) {
    throw redirect({ to: "/auth/login" });
  }

  return next({
    context: { session },
  });
});
