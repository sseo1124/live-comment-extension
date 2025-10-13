import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    action: {},
    web_accessible_resources: [
      {
        resources: ["overlay-main-world.js"],
        matches: ["*://*/*"],
      },
    ],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  }),
});
