import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import { INTERVIEWS_TOOL_TABLE_PREFIX } from "@interviews-tool/domain/config";

dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  schema: ["./src/schema"],
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  tablesFilter: [`${INTERVIEWS_TOOL_TABLE_PREFIX}_*`],
});
