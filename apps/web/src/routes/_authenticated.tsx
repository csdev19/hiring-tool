import { useSession } from "@/hooks/use-session";
import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const cookie = headers.get("cookie");

  console.log("getSessionFn - cookie:", cookie ? "present" : "missing");

  if (!cookie) {
    return null;
  }

  try {
    // Forward cookie to backend to validate session
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      method: "GET",
      headers: {
        cookie,
        "Content-Type": "application/json",
      },
    });

    console.log("getSessionFn - backend response:", response.status);

    if (!response.ok) {
      return null;
    }

    const session: Session | null = await response.json();
    return session;
  } catch (error) {
    console.error("getSessionFn error:", error);
    return null;
  }
});

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    const session = await getSessionFn();
    console.log("beforeLoad session:", session ? "valid" : "null");

    if (!session) {
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
