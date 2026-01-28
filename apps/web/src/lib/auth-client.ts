import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // No baseURL needed - auth requests go to the same origin (frontend)
  // which proxies to the backend, ensuring cookies stay on the frontend domain
  fetchOptions: {
    credentials: "include",
  },
});
