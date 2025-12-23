import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, index, unique } from "drizzle-orm/pg-core";
import { interview } from "./interview";

export const companyDetails = pgTable(
  "company_details",
  {
    id: text("id").primaryKey(),
    interviewId: text("interview_id")
      .notNull()
      .references(() => interview.id, { onDelete: "cascade" }),
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
    index("company_details_interviewId_idx").on(table.interviewId),
    unique("company_details_interviewId_unique").on(table.interviewId),
  ],
);

export const companyDetailsRelations = relations(companyDetails, ({ one }) => ({
  interview: one(interview, {
    fields: [companyDetails.interviewId],
    references: [interview.id],
  }),
}));

// Type exports for TypeScript
export type CompanyDetails = typeof companyDetails.$inferSelect;
export type NewCompanyDetails = typeof companyDetails.$inferInsert;

