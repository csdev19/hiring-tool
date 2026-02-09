import { auth } from "@/lib/auth/auth-server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.log("get request =======> ", request);
        return auth.handler(request);
      },
      POST: async ({ request }) => {
        console.log("post request =======> ", request);
        return auth.handler(request);
      },
      PUT: async ({ request }) => {
        console.log("put request =======> ", request);
        return auth.handler(request);
      },
      PATCH: async ({ request }) => {
        console.log("patch request =======> ", request);
        return auth.handler(request);
      },
      DELETE: async ({ request }) => {
        console.log("delete request =======> ", request);
        return auth.handler(request);
      },
    },
  },
});
