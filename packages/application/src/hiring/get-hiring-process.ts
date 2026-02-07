import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { HiringProcessBase } from "@interviews-tool/domain/schemas";
import type { Result } from "@interviews-tool/domain/types";

export async function getHiringProcess(params: {
  repo: IHiringProcessRepository;
  id: string;
  userId: string;
}): Promise<Result<HiringProcessBase>> {
  const { repo, id, userId } = params;

  try {
    const hiringProcess = await repo.findById(id, userId);

    if (!hiringProcess) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    return { data: hiringProcess, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
