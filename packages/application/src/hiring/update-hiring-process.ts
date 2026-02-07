import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { HiringProcessBase, UpdateHiringProcess } from "@interviews-tool/domain/schemas";
import type { Result } from "@interviews-tool/domain/types";
import { CURRENCIES } from "@interviews-tool/domain/constants";

export async function updateHiringProcess(params: {
  repo: IHiringProcessRepository;
  id: string;
  userId: string;
  input: UpdateHiringProcess;
}): Promise<Result<HiringProcessBase>> {
  const { repo, id, userId, input } = params;

  try {
    const existing = await repo.findById(id, userId);

    if (!existing) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    const updated = await repo.update(id, userId, {
      companyName: input.companyName,
      jobTitle: input.jobTitle,
      status: input.status,
      salary: input.salary,
      currency: input.currency || existing.currency || CURRENCIES.USD,
      salaryRateType: input.salaryRateType ?? existing.salaryRateType,
    });

    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
