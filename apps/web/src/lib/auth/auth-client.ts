import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: import.meta.env.VITE_SERVER_URL,
  baseURL: "https://hiring-tool-web.cristiansotomayor-dev.workers.dev",
  fetchOptions: {
    credentials: "include",
  },
});
