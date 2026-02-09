import { baseConfig, getCustomSession } from "@interviews-tool/infra-auth";
import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
// import { expo } from "@better-auth/expo";
import { env } from "cloudflare:workers";

// export const auth: ReturnType<typeof betterAuth> = betterAuth({
export const auth = betterAuth({
  ...baseConfig,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN, "exp://", "mobile://", "exp://*"],
  // plugins: [...(baseConfig.plugins ?? []), customSession(getCustomSession, baseConfig), expo()],
  plugins: [...(baseConfig.plugins ?? []), customSession(getCustomSession, baseConfig)],
});
