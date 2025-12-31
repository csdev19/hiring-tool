import alchemy from "alchemy";
import { Worker } from "alchemy/cloudflare";
import { env } from "bun";
// import { config } from "dotenv";

// config({ path: "./.env" });

console.log("env.ALCHEMY_PASSWORD", env.ALCHEMY_PASSWORD);
const app = await alchemy("interviews-tool-api", {
  password: env.ALCHEMY_PASSWORD,
});

// export const server = await TanStackStart("server", {
//   bindings: {
//     CORS_ORIGIN: alchemy.env.CORS_ORIGIN,
//     BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET,
//     BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL,
//     DATABASE_URL: alchemy.secret.env.DATABASE_URL,
//     DATABASE_URL_DIRECT: alchemy.secret.env.DATABASE_URL_DIRECT,
//   },
// });
export const server = await Worker("server", {
  name: "server-worker",
  entrypoint: "./src/index.ts",
  bindings: {
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN,
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL,
    DATABASE_URL: alchemy.secret.env.DATABASE_URL,
    DATABASE_URL_DIRECT: alchemy.secret.env.DATABASE_URL_DIRECT,
  },
});

console.log(`Server    -> ${server.url}`);

await app.finalize();
