import { pgEnum } from "drizzle-orm/pg-core";
import { INTERVIEW_STATUS_VALUES } from "@interviews-tool/domain/constants";

// Database enum for interview status
export const interviewStatusEnum = pgEnum("interview_status", INTERVIEW_STATUS_VALUES);
