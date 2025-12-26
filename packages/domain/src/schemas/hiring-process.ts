import { z } from "zod";
import { INTERVIEW_STATUSES, CURRENCIES } from "../constants";

/**
 * Base schema for HiringProcess
 * Represents the complete domain model with all fields
 * This is the single source of truth for the hiring process structure
 */
export const hiringProcessBaseSchema = z.object({
  id: z.uuid(),
  companyName: z.string().min(1, "Company name is required"),
  status: z.enum([
    INTERVIEW_STATUSES.ONGOING,
    INTERVIEW_STATUSES.REJECTED,
    INTERVIEW_STATUSES.DROPPED_OUT,
    INTERVIEW_STATUSES.HIRED,
  ]),
  salary: z.number().min(0, "Salary must be positive").nullable(),
  currency: z.enum([CURRENCIES.USD, CURRENCIES.PEN]),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Create schema - derived from base
 * Fields needed to create a new hiring process
 * Omits id, userId, timestamps (server-generated)
 */
export const createHiringProcessSchema = hiringProcessBaseSchema
  .pick({
    companyName: true,
    status: true,
  })
  .extend({
    // Make salary and currency optional on creation
    salary: z.number().min(0, "Salary must be positive").optional(),
    currency: z.enum([CURRENCIES.USD, CURRENCIES.PEN]).optional(),
  });

/**
 * Update schema - derived from create
 * Fields that can be updated (same as create for hiring process)
 */
export const updateHiringProcessSchema = createHiringProcessSchema;

/**
 * Partial update schema
 * All fields optional for partial updates
 */
export const partialUpdateHiringProcessSchema = updateHiringProcessSchema.partial();

/**
 * Query/Filter schema
 * For filtering hiring processes
 */
export const filterHiringProcessSchema = z.object({
  status: z
    .enum([
      INTERVIEW_STATUSES.ONGOING,
      INTERVIEW_STATUSES.REJECTED,
      INTERVIEW_STATUSES.DROPPED_OUT,
      INTERVIEW_STATUSES.HIRED,
    ])
    .optional(),
  companyName: z.string().optional(),
});

// Type exports for TypeScript
export type HiringProcessBase = z.infer<typeof hiringProcessBaseSchema>;
export type CreateHiringProcess = z.infer<typeof createHiringProcessSchema>;
export type UpdateHiringProcess = z.infer<typeof updateHiringProcessSchema>;
export type PartialUpdateHiringProcess = z.infer<typeof partialUpdateHiringProcessSchema>;
export type FilterHiringProcess = z.infer<typeof filterHiringProcessSchema>;

