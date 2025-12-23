import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { companyDetails } from "./company-details";

export const interview = pgTable(
  "interview",
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
    index("interview_userId_idx").on(table.userId),
    index("interview_status_idx").on(table.status),
  ],
);

export const interviewRelations = relations(interview, ({ one }) => ({
  user: one(user, {
    fields: [interview.userId],
    references: [user.id],
  }),
  companyDetails: one(companyDetails, {
    fields: [interview.id],
    references: [companyDetails.interviewId],
  }),
}));

// Type exports for TypeScript
export type Interview = typeof interview.$inferSelect;
export type NewInterview = typeof interview.$inferInsert;
