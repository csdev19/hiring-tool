import { webClientEnvSchema } from "@interviews-tool/config";

export const env = webClientEnvSchema.parse(import.meta.env);
