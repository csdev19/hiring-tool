import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { CreateHiringProcess, HiringProcessBase } from "@interviews-tool/domain/schemas";
import type { Result } from "@interviews-tool/domain/types";
import { CURRENCIES, SALARY_RATE_TYPES } from "@interviews-tool/domain/constants";

/**
 * Creates a new hiring process.
 *
 * This is a use case — it orchestrates the creation of a hiring process
 * by applying business defaults and delegating persistence to the repository.
 *
 * **Why this lives in `packages/application/` and not in a route handler:**
 * Multiple server-side consumers need the same logic:
 * - Elysia API routes (for mobile/external clients)
 * - TanStack Start serverFn (for the web app, no HTTP hop)
 * - Astro server functions (for the marketing site)
 * - Cron jobs / workers (for automated processes)
 *
 * **Dependency rule:** This function depends only on domain interfaces.
 * It never imports from `@interviews-tool/infra-db` or any infrastructure package.
 * The caller (route handler, serverFn, etc.) wires the concrete repository.
 *
 * @example
 * // In an Elysia route:
 * import { createHiringProcess } from "@interviews-tool/application/hiring";
 * import { HiringProcessRepository } from "@interviews-tool/infra-db/repositories";
 *
 * const repo = new HiringProcessRepository(db);
 * const result = await createHiringProcess({ repo, input, userId });
 *
 * @example
 * // In a TanStack Start serverFn:
 * import { createHiringProcess } from "@interviews-tool/application/hiring";
 * import { HiringProcessRepository } from "@interviews-tool/infra-db/repositories";
 *
 * export const createHiringSFn = createServerFn({ method: "POST" })
 *   .validator(createHiringProcessSchema)
 *   .handler(async ({ data, context }) => {
 *     const repo = new HiringProcessRepository(db);
 *     return createHiringProcess({ repo, input: data, userId: context.user.id });
 *   });
 */
export async function createHiringProcess(params: {
  repo: IHiringProcessRepository;
  input: CreateHiringProcess;
  userId: string;
}): Promise<Result<HiringProcessBase>> {
  const { repo, input, userId } = params;

  const hiringProcess: HiringProcessBase = {
    id: crypto.randomUUID(),
    companyName: input.companyName,
    jobTitle: input.jobTitle ?? null,
    status: input.status,
    salary: input.salary ?? null,
    currency: input.currency ?? CURRENCIES.USD,
    salaryRateType: input.salaryRateType ?? SALARY_RATE_TYPES.MONTHLY,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  try {
    await repo.save(hiringProcess);
    return { data: hiringProcess, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
