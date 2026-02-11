import { env as cfEnv } from "cloudflare:workers";
import { serverEnvSchema } from "@interviews-tool/infra-env";

export const env = serverEnvSchema.parse(cfEnv);
