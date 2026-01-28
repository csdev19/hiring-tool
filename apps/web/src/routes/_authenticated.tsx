import { useSession } from "@/hooks/use-session";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./api/auth/$";

const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const cookie = headers.get("cookie");

  console.log("getSessionFn - cookie:", cookie ? "present" : "missing");

  const session = await auth.api.getSession({ headers });
  console.log("getSessionFn - session:", session);
  return session;
});

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    const session = await getSessionFn();
    console.log("beforeLoad session:", session ? "valid" : "null");
    console.log("beforeLoad session ->", session);

    // if (!session) {
    //   throw redirect({ to: "/auth/login" });
    // }

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
