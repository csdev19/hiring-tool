import { useSession } from "@/hooks/use-session";
import { auth } from "@/lib/auth-server";
import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

// interface SessionData {
//   user: {
//     id: string;
//     email: string;
//     name: string | null;
//   } | null;
//   session: {
//     id: string;
//     expiresAt: string;
//   } | null;
// }

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  // const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
  // console.log("BACKEND_URL ->", BACKEND_URL);

  // if (!BACKEND_URL) {
  //   console.error("VITE_SERVER_URL is not configured");
  //   return null;
  // }

  // const request = getRequest();
  // const cookies = request.headers.get("cookie") || "";
  // console.log("cookies ->", cookies);

  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  console.log("session ->", session);
  return session;

  // try {
  //   const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
  //     headers: {
  //       cookie: cookies,
  //     },
  //   });

  //   if (!response.ok) {
  //     return null;
  //   }

  //   const sessionData: SessionData = await response.json();
  //   console.log("sessionData ->", sessionData);
  //   return sessionData;
  // } catch (error) {
  //   console.error("Failed to get session:", error);
  //   return null;
  // }
});

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  console.log("authMiddleware ->");
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  // if (!session) {
  //   throw redirect({ to: "/login" });
  // }
  console.log("session middleware ->", session);
  return await next();
});

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  server: {
    middleware: [authMiddleware],
  },
  // middleware: [authMiddleware],
  // beforeLoad: async () => {
  //   try {
  //     console.log("before load --------------->");
  //     const session = await getAuth();
  //     console.log("session before load--------------->", session);
  //     // if (!session?.user) {
  //     //   throw redirect({ to: "/auth/login" });
  //     // }
  //     return { session };
  //   } catch (error) {
  //     console.error("Failed to get session:", error);
  //     return null;
  //   }
  // },
});

function AuthenticatedLayout() {
  const { session, isPending } = useSession();

  if (!session && !isPending) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
