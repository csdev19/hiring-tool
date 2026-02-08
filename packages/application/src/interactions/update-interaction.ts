import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { IInteractionRepository } from "@interviews-tool/domain/repositories";
import type { UpdateInteraction, InteractionBase } from "@interviews-tool/domain/schemas";
import type { Result } from "@interviews-tool/domain/types";

export async function updateInteraction(params: {
  hiringProcessRepo: IHiringProcessRepository;
  interactionRepo: IInteractionRepository;
  hiringProcessId: string;
  interactionId: string;
  userId: string;
  input: UpdateInteraction;
}): Promise<Result<InteractionBase>> {
  const { hiringProcessRepo, interactionRepo, hiringProcessId, interactionId, userId, input } =
    params;

  try {
    const hiringProcess = await hiringProcessRepo.findById(hiringProcessId, userId);

    if (!hiringProcess) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    const existing = await interactionRepo.findById(interactionId, hiringProcessId);

    if (!existing) {
      return { data: null, error: new Error("Interaction not found") };
    }

    const updated = await interactionRepo.update(interactionId, {
      title: input.title,
      content: input.content,
      type: input.type,
    });

    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
