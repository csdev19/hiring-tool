import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

config({ path: "../server/.env" });

const app = await alchemy("interviews-tool", {
  password: alchemy.env.ALCHEMY_PASSWORD,
  stateStore:
    alchemy.env.ENVIRONMENT === "production"
      ? (scope) =>
          new CloudflareStateStore(scope, {
            stateToken: alchemy.secret(alchemy.env.CLOUDFLARE_API_TOKEN),
            accountId: alchemy.env.CLOUDFLARE_ACCOUNT_ID,
          })
      : undefined,
});

export const web = await TanStackStart("web", {
  bindings: {
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL,
    DATABASE_URL: alchemy.secret.env.DATABASE_URL,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN,
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL,
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
