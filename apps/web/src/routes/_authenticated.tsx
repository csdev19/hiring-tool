import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuthClient } from "better-auth/react";

// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const headers = await getRequestHeaders();
  console.log("headers ->", headers);

  console.log("import.meta.env.VITE_SERVER_URL", import.meta.env.VITE_SERVER_URL);
  console.log("process.env.VITE_SERVER_URL", process.env.VITE_SERVER_URL);

  // const cookies = await getRequestCookies();
  const cookieHeader = headers.get("cookie");
  console.log("cookieHeader ->", cookieHeader);

  const { data, error } = await authClient.getSession({
    fetchOptions: {
      headers: headers,
    },
  });

  const authClient2 = createAuthClient({
    baseURL: "https://hiring-tool-api.cristiansotomayor-dev.workers.dev",
  });

  const data2 = await authClient2.getSession({
    fetchOptions: {
      headers: {
        ...headers,
        cookie: cookieHeader,
        "content-type": "application/json",
      },
    },
  });

  console.log("data2 ->", data2);

  if (error) {
    console.log("error", error);
    return null;
  }

  return {
    user: data?.user,
    session: data?.session,
  };
});

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  // server: {
  // middleware: [authMiddleware],
  // },
  beforeLoad: async () => {
    const session = await getCurrentUserFn();
    console.log("session ->", session);

    if (!session) {
      // throw redirect({ to: "/auth/login" });
    }

    return { session };
  },
});

function AuthenticatedLayout() {
  return <Outlet />;
}
