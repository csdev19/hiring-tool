/**
 * Side-by-side demo: read the SAME hiring-process rows from the SAME Neon tables using
 * Drizzle (@interviews-tool/infra-db) and Prisma (@interviews-tool/infra-prisma-db).
 *
 * Run with the DB URL injected (dotenvx or inline):
 *   dotenvx run -f ../../apps/server/.env -- bun run examples/compare-orms.ts
 *   DATABASE_URL="postgresql://..." bun run examples/compare-orms.ts
 *
 * Neither ORM owns anything here — they are two abstraction layers over identical tables.
 */
import { createDatabaseClient } from "@interviews-tool/infra-db/client";
import { hiringProcessTable } from "@interviews-tool/infra-db/schemas";
import { createNodePrismaClient } from "../src/client/node";

const databaseUrl = process.env.DATABASE_URL || "";

// --- Drizzle ---------------------------------------------------------------
const drizzle = createDatabaseClient(databaseUrl);
const drizzleRows = (
  await drizzle
    .select({
      id: hiringProcessTable.id,
      company: hiringProcessTable.companyName,
      status: hiringProcessTable.status,
    })
    .from(hiringProcessTable)
)
  .sort((a, b) => a.id.localeCompare(b.id))
  .slice(0, 3);

// --- Prisma ----------------------------------------------------------------
const prisma = createNodePrismaClient(databaseUrl);
const prismaRows = await prisma.interviews_tool_hiring_process.findMany({
  take: 3,
  orderBy: { id: "asc" },
  select: { id: true, company_name: true, status: true },
});

console.log("=== Drizzle (@interviews-tool/infra-db) ===");
console.table(drizzleRows);
console.log("=== Prisma  (@interviews-tool/infra-prisma-db) ===");
console.table(prismaRows.map((r) => ({ id: r.id, company: r.company_name, status: r.status })));

const totalDrizzle = (await drizzle.select().from(hiringProcessTable)).length;
const totalPrisma = await prisma.interviews_tool_hiring_process.count();
console.log(`\nTotal rows — Drizzle: ${totalDrizzle} | Prisma: ${totalPrisma}`);
