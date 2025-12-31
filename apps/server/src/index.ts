// import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { createAuth } from "@interviews-tool/auth";
import { Elysia } from "elysia";
import { hiringProcessRoutes } from "./routes/hiring-processes";
import { companyDetailsRoutes } from "./routes/company-details";
import { interactionRoutes } from "./routes/interactions";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      const auth = createAuth(process.env.CORS_ORIGIN || "");
      return auth.handler(request);
    }
    return status(405);
  })
  .use(hiringProcessRoutes)
  .use(companyDetailsRoutes)
  .use(interactionRoutes)
  .get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
  }))
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  })
  .compile();

export type App = typeof app;

export default {
  fetch: (request: Request, env: { CORS_ORIGIN?: string }, ctx: ExecutionContext) => {
    console.log("env", env);

    process.env.CORS_ORIGIN ??= (() => {
      if (typeof env.CORS_ORIGIN === "string") {
        return env.CORS_ORIGIN;
      }
      return "";
    })();

    return app.fetch(request, env, ctx);
  },
};
