import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/routes/api/auth/$";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const cookie = headers.get("cookie");

  console.log("auth middleware ------>");
  console.log("Cookie header:", cookie ? "present" : "NO COOKIE");

  try {
    const session = await auth.api.getSession({ headers });
    // if (!session) {
    //   throw redirect({ to: "/auth/login" });
    // }

    console.log("session ->", session);
    return next({
      context: { session },
    });
    // return next({
    //   context: { session },
    // });
  } catch (error) {
    console.error("auth middleware error ->", error);
    return next({
      context: { session: null },
    });
  }
});
