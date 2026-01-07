import { cors } from "@elysiajs/cors";
import { auth } from "@interviews-tool/auth";
import { Elysia } from "elysia";
import { hiringProcessRoutes } from "./routes/hiring-processes";
import { companyDetailsRoutes } from "./routes/company-details";
import { interactionRoutes } from "./routes/interactions";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { env } from "cloudflare:workers";

const authRoutes = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN || "",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .mount(auth.handler);

const apiRoutes = new Elysia({
  prefix: "/api/v1",
})
  .use(hiringProcessRoutes)
  .use(companyDetailsRoutes)
  .use(interactionRoutes)
  .get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
  }));

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .use(
    cors({
      origin: env.CORS_ORIGIN || "",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(authRoutes)
  .use(apiRoutes)
  .compile();

export type App = typeof app;

export default {
  fetch: (request: Request, env: CloudflareBindings, ctx: ExecutionContext) => {
    return app.fetch(request, env, ctx);
  },
};
