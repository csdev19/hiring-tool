import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { IInteractionRepository } from "@interviews-tool/domain/repositories";
import type { Result } from "@interviews-tool/domain/types";

export async function deleteInteraction(params: {
  hiringProcessRepo: IHiringProcessRepository;
  interactionRepo: IInteractionRepository;
  hiringProcessId: string;
  interactionId: string;
  userId: string;
}): Promise<Result<void>> {
  const { hiringProcessRepo, interactionRepo, hiringProcessId, interactionId, userId } = params;

  try {
    const hiringProcess = await hiringProcessRepo.findById(hiringProcessId, userId);

    if (!hiringProcess) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    const existing = await interactionRepo.findById(interactionId, hiringProcessId);

    if (!existing) {
      return { data: null, error: new Error("Interaction not found") };
    }

    await interactionRepo.delete(interactionId);
    return { data: undefined, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
