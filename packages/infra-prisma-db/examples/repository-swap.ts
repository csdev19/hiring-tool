/**
 * Repository swap demo: run the SAME application use case (`listHiringProcesses`) served by a
 * Drizzle repository and a Prisma repository. Both implement the same domain port
 * (`IHiringProcessRepository`), so the use case is unchanged — only the injected adapter
 * differs. Output (including the domain `status` enum) is identical.
 *
 *   dotenvx run -f ../../apps/server/.env -- bun run examples/repository-swap.ts
 *   DATABASE_URL="postgresql://..." bun run examples/repository-swap.ts
 */
import { createDatabaseClient } from "@interviews-tool/infra-db/client";
import { HiringProcessRepository } from "@interviews-tool/infra-db/repositories";
import { listHiringProcesses } from "@interviews-tool/application/hiring";
import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { PrismaClient } from "../src/client";
import { createNodePrismaClient } from "../src/client/node";
import { PrismaHiringProcessRepository } from "../src/repositories";

const databaseUrl = process.env.DATABASE_URL || "";

const drizzleRepo = new HiringProcessRepository(createDatabaseClient(databaseUrl));
// Scripts run on Bun, so use the node client. The repository is typed against the workerd
// client (used by the apps); the two are generated from the same schema, hence the cast.
const prismaClient = createNodePrismaClient(databaseUrl);
const prismaRepo = new PrismaHiringProcessRepository(prismaClient as unknown as PrismaClient);

// Pick a user that actually has hiring processes so the demo shows rows.
const sample = await prismaClient.interviews_tool_hiring_process.findFirst({
  where: { deleted_at: null },
  select: { user_id: true },
});

if (!sample) {
  console.log("No hiring processes found — nothing to demo.");
  process.exit(0);
}

const userId = sample.user_id;
const pagination = { page: 1, limit: 5 };

const repos: Array<[string, IHiringProcessRepository]> = [
  ["Drizzle", drizzleRepo],
  ["Prisma", prismaRepo],
];

for (const [name, repo] of repos) {
  const result = await listHiringProcesses({ repo, userId, pagination });
  if (result.error) {
    console.error(`${name} repo failed:`, result.error.message);
    continue;
  }
  const { data, total, page, totalPages } = result.data;
  console.log(`\n=== listHiringProcesses() via ${name} repository ===`);
  console.log(`user=${userId.slice(0, 8)}…  total=${total}  page=${page}/${totalPages}`);
  console.table(
    data.map((h) => ({ id: h.id.slice(0, 8), company: h.companyName, status: h.status })),
  );
}
