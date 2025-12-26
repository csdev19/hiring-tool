import { relations } from "drizzle-orm";
import { text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { createTable } from "../utils/table-creator";
import { userTable } from "./auth";
import { companyDetailsTable } from "./company-details";
import { interactionTable } from "./interaction";
import { interviewStatusEnum, currencyEnum } from "../enums";

export const hiringProcessTable = createTable(
  "hiring_process",
  {
    id: text("id").primaryKey(),
    companyName: text("company_name").notNull(),
    status: interviewStatusEnum("status").notNull(),
    salary: integer("salary"), // Optional salary amount
    currency: currencyEnum("currency").default("USD").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("hiring_process_userId_idx").on(table.userId),
    index("hiring_process_status_idx").on(table.status),
  ],
);

export const hiringProcessRelations = relations(hiringProcessTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [hiringProcessTable.userId],
    references: [userTable.id],
  }),
  companyDetails: one(companyDetailsTable, {
    fields: [hiringProcessTable.id],
    references: [companyDetailsTable.hiringProcessId],
  }),
  interactions: many(interactionTable),
  // interviews: many(interviewTable), // Prepared for future - will be uncommented when interview entity is implemented
}));

// Type exports for TypeScript
export type HiringProcess = typeof hiringProcessTable.$inferSelect;
export type NewHiringProcess = typeof hiringProcessTable.$inferInsert;
