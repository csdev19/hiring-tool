import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

// TODO: I have to make this work eventually
// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async (ctx) => {
  const request = await getRequest();
  const headers = await request.headers;
  const sessionData = await authClient.getSession({
    fetchOptions: {
      headers: headers,
    },
  });
  console.log("sessionData ->", sessionData);
  // //   credentials: "include",
  // },

  const { data, error } = sessionData;

  if (error) {
    console.log("error", error);
    return null;
  }

  return {
    user: data?.user,
    session: data?.session,
  };
});

const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    console.log("auth middleware ->", import.meta.env.VITE_SERVER_URL);
    const session = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
        credentials: "include",
        baseURL: `${import.meta.env.VITE_SERVER_URL}/api/auth`,
      },
    });
    console.log("session middleware1 ->", session);
    const session2 = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
      },
    });
    console.log("session middleware2 ->", session2);
    const session3 = await authClient.getSession();
    console.log("session middleware3 ->", session3);
    return next({ context: {} });
  } catch (error) {
    console.error("error", error);
    return next({ context: {} });
  }
});

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  server: {
    middleware: [authMiddleware],
  },

  beforeLoad: async () => {
    try {
      console.log("before load ->");
      const session = await getCurrentUserFn();
      console.log("session before load ->", session);
    } catch (error) {
      console.error("error", error);
      return { session: undefined };
    }
    //   const session = await getCurrentUserFn();
    //   console.log("session before load ->", session);
    //   // console.log("session ->", session);

    //   // if (!session) {
    //   //   // throw redirect({ to: "/auth/login" });
    //   // }

    //   return { session };
  },
});

function AuthenticatedLayout() {
  const { session, isPending } = useSession();

  if (!session && !isPending) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
