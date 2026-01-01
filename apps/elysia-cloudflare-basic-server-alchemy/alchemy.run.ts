import { env } from "bun";
import alchemy from "alchemy";
import { Worker } from "alchemy/cloudflare";

export const app = await alchemy("elysia-cloudflare-basic-server-alchemy", {
  password: env.ALCHEMY_PASSWORD,
});

export const server = await Worker("server", {
  name: "server-worker",
  entrypoint: "./src/index.ts",
  bindings: {
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN,
    SECRET_VARIABLE: alchemy.secret.env.SECRET_VARIABLE,
  },
  dev: {
    port: 3000,
  },
});

console.log(`Server    -> ${server.url}`);

await app.finalize();
