import { env as cfEnv } from "cloudflare:workers";
import { serverEnvSchema } from "@interviews-tool/config";

export const env = serverEnvSchema.parse(cfEnv);
