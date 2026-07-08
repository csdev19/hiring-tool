import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated-node/client";

/**
 * Node/Bun-runtime Prisma client, for local scripts and tooling only (see the `clientNode`
 * generator in schema.prisma). The deployed apps use the workerd client from `./index.ts`;
 * this build exists because the workerd client's WASM query compiler can't run under Bun.
 */
export const createNodePrismaClient = (databaseUrl: string) => {
  const adapter = new PrismaNeonHttp(databaseUrl, {});
  return new PrismaClient({ adapter });
};
