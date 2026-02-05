import { baseConfig, getCustomSession } from "@interviews-tool/auth";
import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { env } from "cloudflare:workers";

// export const auth: ReturnType<typeof betterAuth> = betterAuth({
export const auth = betterAuth({
  ...baseConfig,
  // Include null for Android native apps which send null/missing origin
  trustedOrigins: [env.CORS_ORIGIN, "exp://", "mobile://", "exp://*"],
  plugins: [...(baseConfig.plugins ?? []), customSession(getCustomSession, baseConfig), expo()],
});
