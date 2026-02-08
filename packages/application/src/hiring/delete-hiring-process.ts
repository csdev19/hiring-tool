import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { Result } from "@interviews-tool/domain/types";

export async function deleteHiringProcess(params: {
  repo: IHiringProcessRepository;
  id: string;
  userId: string;
}): Promise<Result<void>> {
  const { repo, id, userId } = params;

  try {
    const existing = await repo.findById(id, userId);

    if (!existing) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    await repo.delete(id, userId);
    return { data: undefined, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
