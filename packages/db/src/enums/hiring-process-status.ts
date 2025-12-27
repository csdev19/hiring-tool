import { pgEnum } from "drizzle-orm/pg-core";
import { HIRING_PROCESS_STATUS_VALUES } from "@interviews-tool/domain/constants";

// Database enum for hiring process status
export const hiringProcessStatusEnum = pgEnum(
  "hiring_process_status",
  HIRING_PROCESS_STATUS_VALUES,
);
