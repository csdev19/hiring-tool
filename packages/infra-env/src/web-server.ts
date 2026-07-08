import { z } from "zod";

export const webServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  VITE_SERVER_URL: z.string().min(1),
});
