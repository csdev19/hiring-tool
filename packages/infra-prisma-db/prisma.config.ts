import { defineConfig } from "prisma/config";

// Prisma 7 configuration. The connection URL used by CLI commands (db pull, migrate,
// studio) lives here — NOT in schema.prisma. We use the DIRECT (non-pooler) Neon URL for
// introspection; the runtime client connects via the Neon driver adapter instead.
//
// We read process.env directly (with an empty fallback) instead of Prisma's `env()` helper
// so that `prisma generate` — which needs no database connection — never fails when the URL
// is absent. Introspection/migration commands still require DATABASE_URL_DIRECT to be set
// (inject it via dotenvx or inline).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL_DIRECT ?? "",
  },
});
