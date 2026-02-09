import { auth } from "./auth-server";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { AuthSession } from "./types";

export const getAuthSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthSession | null> => {
    const headers = getRequestHeaders();
    console.log("headers =======> ", headers);
    const session = await auth.api.getSession({ headers });
    console.log("session =======> ", session);
    if (!session) {
      return null;
    }
    return {
      session: session.session,
      user: session.user,
    };
  },
);
