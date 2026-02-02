import { auth } from "./auth-server";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getAuthSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session;
});

// {
//   session: {
//       id: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//       expiresAt: Date;
//       token: string;
//       ipAddress?: string | null | undefined | undefined;
//       userAgent?: string | null | undefined | undefined;
//   } | undefined;
//   user: {
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
//     email: string;
//     emailVerified: boolean;
//     name: string;
//     image?: string | null | undefined | undefined;
//   } | undefined
// }
