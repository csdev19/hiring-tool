import type { IHiringProcessRepository } from "@interviews-tool/domain/repositories";
import type { IInteractionRepository } from "@interviews-tool/domain/repositories";
import type { CreateInteraction, InteractionBase } from "@interviews-tool/domain/schemas";
import type { Result } from "@interviews-tool/domain/types";
import { INTERACTION_TYPES } from "@interviews-tool/domain/constants";

export async function createInteraction(params: {
  hiringProcessRepo: IHiringProcessRepository;
  interactionRepo: IInteractionRepository;
  hiringProcessId: string;
  userId: string;
  input: CreateInteraction;
}): Promise<Result<InteractionBase>> {
  const { hiringProcessRepo, interactionRepo, hiringProcessId, userId, input } = params;

  try {
    const hiringProcess = await hiringProcessRepo.findById(hiringProcessId, userId);

    if (!hiringProcess) {
      return { data: null, error: new Error("Hiring process not found") };
    }

    const interaction: InteractionBase = {
      id: crypto.randomUUID(),
      hiringProcessId,
      title: input.title ?? null,
      content: input.content,
      type: input.type ?? INTERACTION_TYPES.NOTE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    await interactionRepo.save(interaction);
    return { data: interaction, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
