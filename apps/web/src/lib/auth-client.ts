import { createAuthClient } from "better-auth/react";

// Client-side auth client - uses our proxy route to avoid cross-origin cookie issues
// IMPORTANT: This should only be used on the client side
// For server-side auth, use the middleware or server functions that call the backend directly
export const authClient = createAuthClient({
  // Use relative URL - works in browser context
  // The proxy at /api/auth forwards requests to the backend
  // baseURL: typeof window !== "undefined" ? "/api/auth" : "http://localhost:3000/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});
