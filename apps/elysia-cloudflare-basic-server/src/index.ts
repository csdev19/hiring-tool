import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

const app = new Elysia({
  adapter: CloudflareAdapter,
})
  .get("/", () => {
    return { message: "Hello Elysia + Cloudflare Worker" };
  })
  .get("/env", () => {
    return {
      secret: process.env.SECRET_VARIABLE,
      public: process.env.PUBLIC_URL,
    };
  })
  .compile();

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export default {
  fetch: (request: Request, env: CloudflareBindings, ctx: ExecutionContext) => {
    // first alternative:
    if (typeof process !== "undefined") {
      process.env.SECRET_VARIABLE ??= env.SECRET_VARIABLE;
      process.env.PUBLIC_URL ??= env.PUBLIC_URL;
    }

    return app.fetch(request, env, ctx);
  },
};
