import type { InteractionBase } from "@interviews-tool/domain/schemas";

export class InteractionMapper {
  static toDomain(row: any): InteractionBase {
    return {
      id: row.id,
      hiringProcessId: row.hiringProcessId,
      title: row.title,
      content: row.content,
      type: row.type,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
    };
  }

  static toPersistence(interaction: InteractionBase): any {
    return {
      id: interaction.id,
      hiringProcessId: interaction.hiringProcessId,
      title: interaction.title,
      content: interaction.content,
      type: interaction.type,
      createdAt: interaction.createdAt,
      updatedAt: interaction.updatedAt,
      deletedAt: interaction.deletedAt,
    };
  }
}
