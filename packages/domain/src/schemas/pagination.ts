import { z } from "zod";
import { HIRING_PROCESS_STATUS_VALUES } from "../constants/hiring-process-status";

/**
 * Pagination query parameters schema
 * Used for list endpoints that support pagination
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1).optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(5)
    .optional(),
});

/**
 * Filter parameters for hiring process queries
 */
export const hiringProcessFilterSchema = z.object({
  statuses: z.array(z.enum(HIRING_PROCESS_STATUS_VALUES)).optional(),
  salaryDeclared: z
    .union([z.boolean(), z.enum(["true", "false"]).transform((v) => v === "true")])
    .optional(),
  salaryMin: z.coerce.number().int().min(0).optional(),
  salaryMax: z.coerce.number().int().min(0).optional(),
});

/**
 * Combined pagination + filter schema for hiring process list queries
 */
export const hiringProcessQuerySchema = paginationQuerySchema.merge(hiringProcessFilterSchema);

// Type exports
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type HiringProcessFilter = z.infer<typeof hiringProcessFilterSchema>;
export type HiringProcessQuery = z.infer<typeof hiringProcessQuerySchema>;
