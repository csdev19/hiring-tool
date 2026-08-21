import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "i18n",
    environment: "node",
    globals: true,
    include: ["src/**/__tests__/**/*.test.ts"],
  },
});
