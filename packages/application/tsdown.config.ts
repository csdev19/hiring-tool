import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    hiring: "src/hiring/index.ts",
    interactions: "src/interactions/index.ts",
  },

  exports: {
    devExports: true,
  },
  format: ["esm"],

  outDir: "dist",
  clean: true,
  sourcemap: true,

  dts: true,

  external: [],

  target: "es2022",

  treeshake: true,
  minify: false,
});
