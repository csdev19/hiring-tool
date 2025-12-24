import { relations } from "drizzle-orm";
import { text, timestamp, integer, index, unique } from "drizzle-orm/pg-core";
import { createTable } from "../utils/table-creator";
import { hiringProcess } from "./hiring-process";

export const companyDetails = createTable(
  "company_details",
  {
    id: text("id").primaryKey(),
    hiringProcessId: text("hiring_process_id")
      .notNull()
      .references(() => hiringProcess.id, { onDelete: "cascade" }),
    website: text("website"),
    location: text("location"),
    benefits: text("benefits"),
    contactedVia: text("contacted_via"),
    contactPerson: text("contact_person"),
    interviewSteps: integer("interview_steps").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("company_details_hiringProcessId_idx").on(table.hiringProcessId),
    unique("company_details_hiringProcessId_unique").on(table.hiringProcessId),
  ],
);

export const companyDetailsRelations = relations(companyDetails, ({ one }) => ({
  hiringProcess: one(hiringProcess, {
    fields: [companyDetails.hiringProcessId],
    references: [hiringProcess.id],
  }),
}));

// Type exports for TypeScript
export type CompanyDetails = typeof companyDetails.$inferSelect;
export type NewCompanyDetails = typeof companyDetails.$inferInsert;
