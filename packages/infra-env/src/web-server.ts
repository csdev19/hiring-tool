import { z } from "zod";
import { commaSeparatedList } from "./transforms";

export const webServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: commaSeparatedList,
  VITE_SERVER_URL: z.string().min(1),
});
