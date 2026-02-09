import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { baseConfig } from "@interviews-tool/infra-auth";

export const auth = betterAuth({
  ...baseConfig,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [...(baseConfig.plugins ?? []), tanstackStartCookies()],
  // plugins: [...(baseConfig.plugins ?? [])],
});
