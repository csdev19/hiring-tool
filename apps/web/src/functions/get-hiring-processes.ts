import { createServerFn } from "@tanstack/react-start";
import { getAuthSession } from "@/lib/auth/get-auth-session";
import { createDatabaseClient } from "@interviews-tool/db/client";
import { HiringProcessRepository } from "@interviews-tool/db/repositories";
import type { ApiResponse, HiringProcessFilterParams } from "@interviews-tool/domain/types";
import type { HiringProcessBase } from "@interviews-tool/domain/schemas";

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

    const db = createDatabaseClient(process.env.DATABASE_URL!);
    const repository = new HiringProcessRepository(db);
    const result = await repository.findPaginated(
      session.user.id,
      { page, limit },
      { statuses, salaryDeclared, salaryMin, salaryMax },
    );

    return {
      data: result.data,
      error: null,
      meta: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
    };
  });
