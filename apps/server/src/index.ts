import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { hiringProcessRoutes } from "./routes/hiring-processes";
import { companyDetailsRoutes } from "./routes/company-details";
import { interactionRoutes } from "./routes/interactions";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { env } from "cloudflare:workers";
import { auth } from "./lib/auth";

// Configure CORS once at the app level
// Split CORS_ORIGIN by comma to support multiple origins
// const allowedOrigins = env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || [];

const corsConfig = {
  origin: ["exp://", "mobile://", env.CORS_ORIGIN || "*"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

const authRoutes = new Elysia().use(cors(corsConfig)).mount(auth.handler);

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

const baseApp = new Elysia({
  adapter: CloudflareAdapter,
})
  .use(authRoutes)
  .use(apiRoutes);

export type App = typeof baseApp;

const app = baseApp.compile();

export default {
  fetch: (request: Request, env: CloudflareBindings, ctx: ExecutionContext) => {
    return app.fetch(request, env, ctx);
  },
};
