import { relations } from "drizzle-orm";
import { text, timestamp, index } from "drizzle-orm/pg-core";
import { createTable } from "../utils/table-creator";
import { hiringProcess } from "./hiring-process";

/**
 * Interview entity for individual interview sessions within a hiring process.
 * This is prepared for future implementation and is not currently used in the application.
 */
export const interview = createTable(
  "interview",
  {
    id: text("id").primaryKey(),
    hiringProcessId: text("hiring_process_id")
      .notNull()
      .references(() => hiringProcess.id, { onDelete: "cascade" }),
    type: text("type"), // e.g., "phone", "technical", "final", "hr", etc.
    scheduledAt: timestamp("scheduled_at"),
    status: text("status"), // e.g., "scheduled", "completed", "cancelled", "no-show"
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("interview_hiringProcessId_idx").on(table.hiringProcessId)],
);

export const interviewRelations = relations(interview, ({ one }) => ({
  hiringProcess: one(hiringProcess, {
    fields: [interview.hiringProcessId],
    references: [hiringProcess.id],
  }),
}));

// Type exports for TypeScript
export type Interview = typeof interview.$inferSelect;
export type NewInterview = typeof interview.$inferInsert;
