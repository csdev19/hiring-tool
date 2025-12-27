import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    libInjectCss(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "WebUI",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-markdown", "remark-gfm"],
    },
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: true,
  },
});
