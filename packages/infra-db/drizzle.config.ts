import { defineConfig } from "drizzle-kit";
import { INTERVIEWS_TOOL_TABLE_PREFIX } from "./src/config";

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: ["./src/schema", "./src/schema/enums"],
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl || "",
  },
  tablesFilter: [`${INTERVIEWS_TOOL_TABLE_PREFIX}_*`],
});
