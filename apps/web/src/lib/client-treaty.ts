import { treaty } from "@elysiajs/eden";
import type { App } from "../../../server/src/index";

export const clientTreaty = treaty<App>(import.meta.env.VITE_SERVER_URL!);
