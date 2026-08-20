import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    web: "src/web.ts",
    config: "src/config.ts",
  },
  exports: { devExports: true },
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  dts: true,
  target: "es2022",
  treeshake: true,
  minify: false,
});
