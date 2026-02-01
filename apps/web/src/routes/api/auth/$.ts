import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  // component: RouteComponent,
  server: {
    handlers: {
      GET: () => {
        return new Response('Hello "/api/$"!');
      },
      POST: () => {
        return new Response('Hello "/api/$"!');
      },
    },
  },
});
