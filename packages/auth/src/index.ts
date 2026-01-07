import { db } from "@interviews-tool/db/client";
import { userTable, accountTable, sessionTable } from "@interviews-tool/db/schemas";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: userTable, account: accountTable, session: sessionTable },
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});

export const createAuth = (corsOrigin: string) => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user: userTable, account: accountTable, session: sessionTable },
    }),
    trustedOrigins: [corsOrigin],
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
  });
};
