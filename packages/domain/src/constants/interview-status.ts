import type { ObjectProperties } from "../types";

export const INTERVIEW_STATUSES = {
  ONGOING: "ongoing",
  REJECTED: "rejected",
  DROPPED_OUT: "dropped-out",
  HIRED: "hired",
} as const;

/**
 * Type for interview status values
 */
export type InterviewStatus = ObjectProperties<typeof INTERVIEW_STATUSES>;

export const INTERVIEW_STATUS_VALUES = [
  INTERVIEW_STATUSES.ONGOING,
  INTERVIEW_STATUSES.REJECTED,
  INTERVIEW_STATUSES.DROPPED_OUT,
  INTERVIEW_STATUSES.HIRED,
] as const;

/**
 * Check if a value is a valid interview status
 */
export function isValidInterviewStatus(value: string): value is InterviewStatus {
  return INTERVIEW_STATUS_VALUES.includes(value as InterviewStatus);
}
