import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { baseConfig } from "@interviews-tool/infra-auth";

export const auth = betterAuth({
  ...baseConfig,
  trustedOrigins: ["*"],
  plugins: [...(baseConfig.plugins ?? []), tanstackStartCookies()],
});
