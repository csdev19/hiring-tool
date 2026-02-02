import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { baseConfig } from "@interviews-tool/auth";

export const auth = betterAuth({
  ...baseConfig,
  plugins: [tanstackStartCookies()],
});
