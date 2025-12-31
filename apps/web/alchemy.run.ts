import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";

const app = await alchemy("interviews-tool-api");

export const web = await TanStackStart("web", {
  bindings: {
    VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL,
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
