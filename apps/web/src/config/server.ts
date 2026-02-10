import { webServerEnvSchema } from "@interviews-tool/config";

export const env = webServerEnvSchema.parse(process.env);
