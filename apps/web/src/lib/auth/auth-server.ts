import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { baseConfig } from "@interviews-tool/infra-auth";
import { env } from "@/config/server";

export const auth = betterAuth({
  ...baseConfig,
  trustedOrigins: [...env.CORS_ORIGIN],
  plugins: [...(baseConfig.plugins ?? []), tanstackStartCookies()],
});
