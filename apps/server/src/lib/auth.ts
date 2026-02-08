import { baseConfig, getCustomSession } from "@interviews-tool/auth";
import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { env } from "cloudflare:workers";

// export const auth: ReturnType<typeof betterAuth> = betterAuth({
export const auth = betterAuth({
  ...baseConfig,
  trustedOrigins: [env.CORS_ORIGIN],
  plugins: [...(baseConfig.plugins ?? []), customSession(getCustomSession, baseConfig)],
});
