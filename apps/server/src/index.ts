import { cors } from "@elysiajs/cors";
import { auth, createAuth } from "@interviews-tool/auth";
import { Elysia } from "elysia";
import { hiringProcessRoutes } from "./routes/hiring-processes";
import { companyDetailsRoutes } from "./routes/company-details";
import { interactionRoutes } from "./routes/interactions";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { env } from "cloudflare:workers";

// Configure CORS once at the app level
const corsConfig = {
  origin: env.CORS_ORIGIN || "*", // Use "*" as fallback for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

const authRoutes = new Elysia().use(cors(corsConfig)).mount(createAuth(env.CORS_ORIGIN).handler);
// const authRoutes = new Elysia().use(cors(corsConfig)).mount(auth.handler);

const apiRoutes = new Elysia({
  prefix: "/api/v1",
})
  .use(cors(corsConfig))
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
  .use(authRoutes)
  .use(apiRoutes)
  .compile();

export type App = typeof app;

export default {
  fetch: (request: Request, env: CloudflareBindings, ctx: ExecutionContext) => {
    return app.fetch(request, env, ctx);
  },
};
