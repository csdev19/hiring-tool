import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const headers = await getRequestHeaders();

  const { data, error } = await authClient.getSession({
    fetchOptions: {
      headers: headers,
    },
  });

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

    if (!session) {
      throw redirect({ to: "/auth/login" });
    }

    // TODO: context.session should be typed from the middleware
    // For now, the middleware handles the redirect if not authenticated
    return { session };
  },
});

function AuthenticatedLayout() {
  return <Outlet />;
}
