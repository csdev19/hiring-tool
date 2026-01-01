import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { userTable, accountTable, sessionTable } from "./schemas";
import { createDatabaseClient } from "./db";
import { cors } from "@elysiajs/cors";

const db = createDatabaseClient(process.env.DATABASE_URL ?? "");

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      account: accountTable,
      session: sessionTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.CORS_ORIGIN ?? ""],
});

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .mount(auth.handler)
  .get("/", () => {
    return { message: "Hello Elysia + Cloudflare Worker + Better Auth" };
  })
  .get("/env", () => {
    return {
      secret: process.env.SECRET_VARIABLE,
      corsOrigin: process.env.CORS_ORIGIN,
    };
  })
  .compile();

export default {
  fetch: (request: Request, env: CloudflareBindings, ctx: ExecutionContext) => {
    // first alternative:
    if (typeof process !== "undefined") {
      process.env.SECRET_VARIABLE ??= env.SECRET_VARIABLE;
      process.env.CORS_ORIGIN ??= env.CORS_ORIGIN;
      process.env.DATABASE_URL ??= env.DATABASE_URL;
    }

    // const auth = betterAuth({
    //   database: drizzleAdapter(db, {
    //     provider: "pg",
    //     schema: {
    //       user: userTable,
    //       account: accountTable,
    //       session: sessionTable,
    //     },
    //   }),
    //   emailAndPassword: {
    //     enabled: true,
    //   },
    //   trustedOrigins: ['http://localhost:3001'],
    //   // trustedOrigins: [process.env.PUBLIC_URL ?? ''],
    // });

    // // Manejar rutas de auth manualmente
    // const url = new URL(request.url);
    // if (url.pathname.startsWith('/api/auth')) {
    //   return auth.handler(request);
    // }

    return app.fetch(request, env, ctx);
  },
};
