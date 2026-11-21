import { readdirSync } from "node:fs";
import { defineConfig } from "vite";

import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";

const tiptapPackages = readdirSync("node_modules/@tiptap").map(
  (name) => `@tiptap/${name}`,
);

export default defineConfig({
  resolve: { tsconfigPaths: true },
  optimizeDeps: {
    exclude: tiptapPackages,
  },
  plugins: [
    vue(),
    ui({
      ui: {
        colors: { primary: "cesi", secondary: "cesi", neutral: "neutral" },
      },
    }),
  ],
});
