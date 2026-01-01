import { defineConfig } from "drizzle-kit";

export const EXAMPLE_TABLE_PREFIX = "example";

export default defineConfig({
  schema: ["./src/schemas.ts"],
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  tablesFilter: [`${EXAMPLE_TABLE_PREFIX}_*`],
});
