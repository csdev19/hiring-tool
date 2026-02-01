import { baseConfig } from "@interviews-tool/auth";
import { betterAuth } from "better-auth";
import { env } from "cloudflare:workers";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...baseConfig,
  trustedOrigins: [env.CORS_ORIGIN],
});
