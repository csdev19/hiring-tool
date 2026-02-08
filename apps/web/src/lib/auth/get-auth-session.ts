import { auth } from "./auth-server";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import type { AuthSession } from "./types";
import { createAuthClient } from "better-auth/react";

export const getAuthSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthSession | null> => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) {
      return null;
    }
    return {
      session: session.session,
      user: session.user,
    };
  },
);

// export const getCookies = createServerFn({ method: "GET" }).handler(
//   async (): Promise<string[]> => {
//     const headers = getRequestHeaders();
//     return headers.cookie?.split("; ") ?? [];
//   },
// );

export const getCookiesFn = createServerOnlyFn((): HeadersInit => {
  const request = getRequest();
  const cookie = request.headers.get("cookie");
  // or
  // const headers = getRequestHeaders();
  // const cookie = headers.get('cookie');

  return cookie ? { cookie } : {};
});

export const getNewAuthSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const authClient2 = createAuthClient({
      // basePath: "/api/auth",
      // baseURL: import.meta.env.VITE_APP_URL || "http://localhost:3001",
      baseURL: "https://hiring-tool-api.cristiansotomayor-dev.workers.dev",
      fetchOptions: {
        credentials: "include",
      },
    });
    // const { data } = await authClient2.useSession({

    // });
    const headers = getRequestHeaders();
    const cookies = getCookiesFn();
    console.log("------> cookies", cookies);
    const res = await authClient2.getSession({
      fetchOptions: {
        headers,
      },
    });
    console.log("------> headers", headers);
    console.log("------> res", res);
    // console.log("data", data);
    // return data;
    // const headers = getRequestHeaders();
    // const session = await auth.api.getSession({ headers });
    // if (!session) {
    //   return null;
    // }
    // return {
    //   session: session.session,
    //   user: session.user,
    // };
  } catch {
    return null;
  }
});
