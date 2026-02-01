import { useSession } from "@/hooks/use-session";
import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

interface SessionData {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
  session: {
    id: string;
    expiresAt: string;
  } | null;
}

export const getAuth = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionData | null> => {
    const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
    console.log("BACKEND_URL ->", BACKEND_URL);

    if (!BACKEND_URL) {
      console.error("VITE_SERVER_URL is not configured");
      return null;
    }

    const request = getRequest();
    const cookies = request.headers.get("cookie") || "";
    console.log("cookies ->", cookies);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
        headers: {
          cookie: cookies,
        },
      });

      if (!response.ok) {
        return null;
      }

      const sessionData: SessionData = await response.json();
      console.log("sessionData ->", sessionData);
      return sessionData;
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  },
);

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    const session = await getAuth();
    if (!session?.user) {
      throw redirect({ to: "/auth/login" });
    }
    return { session };
  },
});

function AuthenticatedLayout() {
  const { session, isPending } = useSession();

  if (!session && !isPending) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
