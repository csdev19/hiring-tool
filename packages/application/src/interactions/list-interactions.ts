import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { IInteractionRepository } from "@interviews-tool/domain/repositories";
import type { InteractionBase } from "@interviews-tool/domain/schemas";
import type { Result } from "@interviews-tool/domain/types";

export async function listInteractions(params: {
  hiringProcessRepo: IHiringProcessRepository;
  interactionRepo: IInteractionRepository;
  hiringProcessId: string;
  userId: string;
}): Promise<Result<InteractionBase[]>> {
  const { hiringProcessRepo, interactionRepo, hiringProcessId, userId } = params;

  try {
    const hiringProcess = await hiringProcessRepo.findById(hiringProcessId, userId);

    if (!hiringProcess) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    const interactions = await interactionRepo.findByHiringProcessId(hiringProcessId);
    return { data: interactions, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
