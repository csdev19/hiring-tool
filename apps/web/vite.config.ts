import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import alchemy from "alchemy/cloudflare/tanstack-start";
// import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    alchemy(),
    // cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  server: {
    port: 3001,
  },
  optimizeDeps: {
    force: true,
  },
  css: {
    devSourcemap: true,
  },
  build: {
    cssCodeSplit: false,
  },
});
