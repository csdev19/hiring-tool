import { relations } from "drizzle-orm";
import { text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { createTable } from "../utils/table-creator";
import { user } from "./auth";
import { companyDetails } from "./company-details";

export const hiringProcess = createTable(
  "hiring_process",
  {
    id: text("id").primaryKey(),
    companyName: text("company_name").notNull(),
    status: text("status").notNull(), // ongoing, rejected, dropped-out, hired
    salary: integer("salary"), // Optional salary amount
    currency: text("currency").default("USD").notNull(), // Currency code (ISO 4217): USD, PEN, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("hiring_process_userId_idx").on(table.userId),
    index("hiring_process_status_idx").on(table.status),
  ],
);

export const hiringProcessRelations = relations(hiringProcess, ({ one }) => ({
  user: one(user, {
    fields: [hiringProcess.userId],
    references: [user.id],
  }),
  companyDetails: one(companyDetails, {
    fields: [hiringProcess.id],
    references: [companyDetails.hiringProcessId],
  }),
  // interviews: many(interview), // Prepared for future - will be uncommented when interview entity is implemented
}));

// Type exports for TypeScript
export type HiringProcess = typeof hiringProcess.$inferSelect;
export type NewHiringProcess = typeof hiringProcess.$inferInsert;
