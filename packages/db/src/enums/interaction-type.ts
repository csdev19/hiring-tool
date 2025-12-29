import { pgEnum } from "drizzle-orm/pg-core";
import { INTERACTION_TYPE_VALUES } from "@interviews-tool/domain/constants";

// Database enum for interaction type
export const interactionTypeEnum = pgEnum("interaction_type", INTERACTION_TYPE_VALUES);
