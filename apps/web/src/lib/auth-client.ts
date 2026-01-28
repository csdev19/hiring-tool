import { createAuthClient } from "better-auth/react";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [tanstackStartCookies()],
});
