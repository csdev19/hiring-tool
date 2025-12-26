import { z } from "zod";
import { INTERACTION_TYPES } from "../constants";

/**
 * Base schema for Interaction
 * Represents the complete interaction model
 */
export const interactionBaseSchema = z.object({
  id: z.uuid(),
  hiringProcessId: z.uuid(),
  title: z.string().max(100, "Title must be less than 100 characters").nullable(),
  content: z.string().min(10, "Content must be at least 10 characters").max(10000),
  type: z.enum([
    INTERACTION_TYPES.EMAIL,
    INTERACTION_TYPES.PHONE_CALL,
    INTERACTION_TYPES.VIDEO_CALL,
    INTERACTION_TYPES.IN_PERSON_MEETING,
    INTERACTION_TYPES.TECHNICAL_CHALLENGE,
    INTERACTION_TYPES.APPLICATION,
    INTERACTION_TYPES.OFFER,
    INTERACTION_TYPES.REJECTION,
    INTERACTION_TYPES.FOLLOW_UP,
    INTERACTION_TYPES.NOTE,
  ]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Create schema - fields needed to create an interaction
 * Note: hiringProcessId comes from URL params, not body
 */
export const createInteractionSchema = z.object({
  title: z.string().max(100, "Title must be less than 100 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").max(10000),
  type: z
    .enum([
      INTERACTION_TYPES.EMAIL,
      INTERACTION_TYPES.PHONE_CALL,
      INTERACTION_TYPES.VIDEO_CALL,
      INTERACTION_TYPES.IN_PERSON_MEETING,
      INTERACTION_TYPES.TECHNICAL_CHALLENGE,
      INTERACTION_TYPES.APPLICATION,
      INTERACTION_TYPES.OFFER,
      INTERACTION_TYPES.REJECTION,
      INTERACTION_TYPES.FOLLOW_UP,
      INTERACTION_TYPES.NOTE,
    ])
    .optional()
    .default(INTERACTION_TYPES.NOTE),
});

/**
 * Update schema - fields that can be updated
 */
export const updateInteractionSchema = z.object({
  title: z.string().max(100, "Title must be less than 100 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").max(10000),
  type: z
    .enum([
      INTERACTION_TYPES.EMAIL,
      INTERACTION_TYPES.PHONE_CALL,
      INTERACTION_TYPES.VIDEO_CALL,
      INTERACTION_TYPES.IN_PERSON_MEETING,
      INTERACTION_TYPES.TECHNICAL_CHALLENGE,
      INTERACTION_TYPES.APPLICATION,
      INTERACTION_TYPES.OFFER,
      INTERACTION_TYPES.REJECTION,
      INTERACTION_TYPES.FOLLOW_UP,
      INTERACTION_TYPES.NOTE,
    ])
    .optional(),
});

// Type exports
export type InteractionBase = z.infer<typeof interactionBaseSchema>;
export type CreateInteraction = z.infer<typeof createInteractionSchema>;
export type UpdateInteraction = z.infer<typeof updateInteractionSchema>;

