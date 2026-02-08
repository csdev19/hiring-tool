import type {
  IHiringProcessRepository,
  PaginatedResult,
} from "@interviews-tool/domain/repositories";
import type { HiringProcessBase } from "@interviews-tool/domain/schemas";
import type {
  Result,
  PaginationParams,
  HiringProcessFilterParams,
} from "@interviews-tool/domain/types";

export async function listHiringProcesses(params: {
  repo: IHiringProcessRepository;
  userId: string;
  pagination: PaginationParams;
  filters?: HiringProcessFilterParams;
}): Promise<Result<PaginatedResult<HiringProcessBase>>> {
  const { repo, userId, pagination, filters } = params;

  try {
    const result = await repo.findPaginated(userId, pagination, filters);
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
