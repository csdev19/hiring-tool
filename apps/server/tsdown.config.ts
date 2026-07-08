import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@interviews-tool\/.*/],
  // The Prisma workerd client imports its WASM query compiler via `?module` (a Cloudflare
  // Workers convention). tsdown/rolldown can't load that; the real Worker bundle is produced
  // by wrangler (main = src/index.ts), which handles it — so keep the .wasm external here.
  external: [/\.wasm(\?.*)?$/],
});
