import { pgEnum } from "drizzle-orm/pg-core";
import { CURRENCY_VALUES } from "@interviews-tool/domain/constants";

// Database enum for currency
export const currencyEnum = pgEnum("currency", CURRENCY_VALUES);
