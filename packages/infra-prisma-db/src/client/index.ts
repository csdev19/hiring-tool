import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/client";

// Prisma 7 client over the SAME Neon tables that @interviews-tool/infra-db (Drizzle) uses.
// We use the Neon HTTP driver adapter (fetch-based) — the same transport Drizzle's
// `neon-http` client uses — so this works on Bun (server) and is edge-ready (Cloudflare
// Workers) without a WebSocket polyfill.
export const createPrismaClient = (databaseUrl: string) => {
  const adapter = new PrismaNeonHttp(databaseUrl, {});
  return new PrismaClient({ adapter });
};

// Default client wired to DATABASE_URL, mirroring @interviews-tool/infra-db/client.
export const db = createPrismaClient(process.env.DATABASE_URL || "");

export type { PrismaClient } from "../generated/client";
