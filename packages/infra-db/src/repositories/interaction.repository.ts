import { eq, and, desc, isNull } from "drizzle-orm";
import { interactionTable } from "../schema";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type * as schema from "../schema";
import type { IInteractionRepository } from "@interviews-tool/domain/repositories";
import type { InteractionBase } from "@interviews-tool/domain/schemas";
import { InteractionMapper } from "../mappers/interaction.mapper";

export class InteractionRepository implements IInteractionRepository {
  constructor(private readonly db: NeonHttpDatabase<typeof schema>) {}

  async findById(id: string, hiringProcessId: string): Promise<InteractionBase | null> {
    const row = await this.db.query.interactionTable.findFirst({
      where: and(
        eq(interactionTable.id, id),
        eq(interactionTable.hiringProcessId, hiringProcessId),
        isNull(interactionTable.deletedAt),
      ),
    });

    return row ? InteractionMapper.toDomain(row) : null;
  }

  async findByHiringProcessId(hiringProcessId: string): Promise<InteractionBase[]> {
    const rows = await this.db
      .select()
      .from(interactionTable)
      .where(
        and(
          eq(interactionTable.hiringProcessId, hiringProcessId),
          isNull(interactionTable.deletedAt),
        ),
      )
      .orderBy(desc(interactionTable.createdAt));

    return rows.map((row) => InteractionMapper.toDomain(row));
  }

  async save(interaction: InteractionBase): Promise<void> {
    const persistence = InteractionMapper.toPersistence(interaction);
    await this.db.insert(interactionTable).values(persistence);
  }

  async update(
    id: string,
    data: Partial<Omit<InteractionBase, "id" | "hiringProcessId" | "createdAt">>,
  ): Promise<InteractionBase> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [updated] = await this.db
      .update(interactionTable)
      .set(updateData)
      .where(eq(interactionTable.id, id))
      .returning();

    if (!updated) {
      throw new Error("Interaction not found");
    }

    return InteractionMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.db
      .update(interactionTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(interactionTable.id, id), isNull(interactionTable.deletedAt)));
  }
}
