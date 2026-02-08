import type { InteractionBase } from "../schemas";

export interface IInteractionRepository {
  findById(id: string, hiringProcessId: string): Promise<InteractionBase | null>;
  findByHiringProcessId(hiringProcessId: string): Promise<InteractionBase[]>;
  save(interaction: InteractionBase): Promise<void>;
  update(
    id: string,
    data: Partial<Omit<InteractionBase, "id" | "hiringProcessId" | "createdAt">>,
  ): Promise<InteractionBase>;
  delete(id: string): Promise<void>;
}
