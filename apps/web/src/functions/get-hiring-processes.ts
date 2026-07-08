import { createServerFn } from "@tanstack/react-start";
import { getAuthSession } from "@/lib/auth/get-auth-session";
import { createPrismaClient } from "@interviews-tool/infra-prisma-db/client";
import { PrismaHiringProcessRepository } from "@interviews-tool/infra-prisma-db/repositories";
import { listHiringProcesses } from "@interviews-tool/application/hiring";
import type { ApiResponse, HiringProcessFilterParams } from "@interviews-tool/domain/types";
import type { HiringProcessBase } from "@interviews-tool/domain/schemas";
import { env } from "@/env/server";

interface GetHiringProcessesInput extends HiringProcessFilterParams {
  page: number;
  limit: number;
}

export const getHiringProcesses = createServerFn({ method: "GET" })
  .inputValidator((input: GetHiringProcessesInput) => input)
  .handler(async (ctx): Promise<ApiResponse<HiringProcessBase[]>> => {
    const { page, limit, statuses, salaryDeclared, salaryMin, salaryMax } = ctx.data;
    const session = await getAuthSession();

    if (!session) {
      return { data: null, error: { message: "Unauthorized" } };
    }

    // This server function (the hiring-processes LIST page) is served by Prisma.
    const repo = new PrismaHiringProcessRepository(createPrismaClient(env.DATABASE_URL));
    // TEMP proof — remove once verified. Prints in the web dev-server terminal on each load.
    console.log("🟢 [get-hiring-processes] LIST served via PRISMA");
    const result = await listHiringProcesses({
      repo,
      userId: session.user.id,
      pagination: { page, limit },
      filters: { statuses, salaryDeclared, salaryMin, salaryMax },
    });

    if (result.error) {
      return { data: null, error: { message: result.error.message } };
    }

    return {
      data: result.data.data,
      error: null,
      meta: {
        pagination: {
          page: result.data.page,
          limit: result.data.limit,
          total: result.data.total,
          totalPages: result.data.totalPages,
        },
      },
    };
  });
