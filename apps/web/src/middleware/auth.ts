import { createMiddleware } from "@tanstack/react-start";

import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  console.log("pre request");
  const session = await authClient.getSession({
    fetchOptions: {
      headers: request.headers,
      throw: true,
    },
  });
  console.log("post request");
  console.log("session -->", session);
  return next({
    context: { session },
  });
});
