import { createAuth } from "@interviews-tool/auth";
import { createFileRoute } from "@tanstack/react-router";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export const auth = createAuth(BACKEND_URL);

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await auth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        return await auth.handler(request);
      },
    },
  },
});
