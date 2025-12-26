import type { ObjectProperties } from "../types";

export const INTERACTION_TYPES = {
  EMAIL: "email",
  PHONE_CALL: "phone-call",
  VIDEO_CALL: "video-call",
  IN_PERSON_MEETING: "in-person-meeting",
  TECHNICAL_CHALLENGE: "technical-challenge",
  APPLICATION: "application",
  OFFER: "offer",
  REJECTION: "rejection",
  FOLLOW_UP: "follow-up",
  NOTE: "note",
} as const;

export type InteractionType = ObjectProperties<typeof INTERACTION_TYPES>;

export const INTERACTION_TYPE_VALUES = [
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
] as const;

export function isValidInteractionType(value: string): value is InteractionType {
  return INTERACTION_TYPE_VALUES.includes(value as InteractionType);
}
