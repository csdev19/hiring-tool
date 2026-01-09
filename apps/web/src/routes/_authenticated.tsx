import { createFileRoute, Outlet } from "@tanstack/react-router";

import { authMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  server: {
    middleware: [authMiddleware],
  },
  beforeLoad: async () => {
    // TODO: context.session should be typed from the middleware
    // For now, the middleware handles the redirect if not authenticated
  },
});

function AuthenticatedLayout() {
  return <Outlet />;
}
