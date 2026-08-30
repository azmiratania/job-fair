import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function getBase() {
  if (process.env.GITHUB_PAGES !== "true") return "/";
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!repo || repo.endsWith(".github.io")) return "/";
  return `/${repo}/`;
}

function spaFallback() {
  return {
    name: "spa-fallback",
    closeBundle() {
      const index = resolve("dist/index.html");
      copyFileSync(index, resolve("dist/404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  base: getBase(),
  server: { port: 5173, host: true },
});
