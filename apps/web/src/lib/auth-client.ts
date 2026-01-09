import { createAuthClient } from "better-auth/react";
import { tanstackStartCookies } from "better-auth/tanstack-start";

console.log("import.meta.env.VITE_SERVER_URL", import.meta.env.VITE_SERVER_URL);
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  plugins: [tanstackStartCookies()],
});
