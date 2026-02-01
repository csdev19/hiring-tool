import { auth } from "@/lib/auth-server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.log("GET request received");
        // return proxyAuthRequest(request);
        // return new Response(JSON.stringify({ message: "GET request received" }), { status: 200 });
        return auth.handler(request);
      },
      POST: async ({ request }) => {
        console.log("POST request received");
        // return proxyAuthRequest(request);
        // return new Response(JSON.stringify({ message: "POST request received" }), { status: 200 });
        return auth.handler(request);
      },
      PUT: async ({ request }) => {
        console.log("PUT request received");
        // return proxyAuthRequest(request);
        // return new Response(JSON.stringify({ message: "PUT request received" }), { status: 200 });
        return auth.handler(request);
      },
      PATCH: async ({ request }) => {
        console.log("PATCH request received");
        // return proxyAuthRequest(request);
        // return new Response(JSON.stringify({ message: "PATCH request received" }), { status: 200 });
        return auth.handler(request);
      },
      DELETE: async ({ request }) => {
        console.log("DELETE request received");
        // return proxyAuthRequest(request);
        // return new Response(JSON.stringify({ message: "DELETE request received" }), {
        //   status: 200,
        // });
        return auth.handler(request);
      },
    },
  },
});
