import { relations } from "drizzle-orm";
import { text, timestamp, integer, index, pgEnum } from "drizzle-orm/pg-core";
import { createTable } from "../utils/table-creator";
import { user } from "./auth";
import { companyDetails } from "./company-details";
import { interaction } from "./interaction";
import { INTERVIEW_STATUS_VALUES, CURRENCY_VALUES } from "@interviews-tool/domain/constants";

// Database enum for interview status
export const interviewStatusEnum = pgEnum("interview_status", INTERVIEW_STATUS_VALUES);

// Database enum for currency
export const currencyEnum = pgEnum("currency", CURRENCY_VALUES);

export const hiringProcess = createTable(
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
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("hiring_process_userId_idx").on(table.userId),
    index("hiring_process_status_idx").on(table.status),
  ],
);

export const hiringProcessRelations = relations(hiringProcess, ({ one, many }) => ({
  user: one(user, {
    fields: [hiringProcess.userId],
    references: [user.id],
  }),
  companyDetails: one(companyDetails, {
    fields: [hiringProcess.id],
    references: [companyDetails.hiringProcessId],
  }),
  interactions: many(interaction),
  // interviews: many(interview), // Prepared for future - will be uncommented when interview entity is implemented
}));

// Type exports for TypeScript
export type HiringProcess = typeof hiringProcess.$inferSelect;
export type NewHiringProcess = typeof hiringProcess.$inferInsert;
