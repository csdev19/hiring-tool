import { relations } from "drizzle-orm";
import { text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { createTable } from "../utils/table-creator";
import { hiringProcess } from "./hiring-process";
import { INTERACTION_TYPE_VALUES } from "@interviews-tool/domain/constants";

export const interactionTypeEnum = pgEnum("interaction_type", INTERACTION_TYPE_VALUES);

export const interaction = createTable(
  "interaction",
  {
    id: text("id").primaryKey(),
    hiringProcessId: text("hiring_process_id")
      .notNull()
      .references(() => hiringProcess.id, { onDelete: "cascade" }),
    title: text("title"),
    content: text("content").notNull(),
    type: interactionTypeEnum("type").default("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("interaction_hiringProcessId_idx").on(table.hiringProcessId),
    index("interaction_createdAt_idx").on(table.createdAt),
  ],
);

export const interactionRelations = relations(interaction, ({ one }) => ({
  hiringProcess: one(hiringProcess, {
    fields: [interaction.hiringProcessId],
    references: [hiringProcess.id],
  }),
}));

// Type exports for TypeScript
export type Interaction = typeof interaction.$inferSelect;
export type NewInteraction = typeof interaction.$inferInsert;

