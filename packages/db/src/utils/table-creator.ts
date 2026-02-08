import { INTERVIEWS_TOOL_TABLE_PREFIX } from "@interviews-tool/domain/config";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `${INTERVIEWS_TOOL_TABLE_PREFIX}_${name}`);
