import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const pkg = JSON.parse(readFileSync(r("./package.json"), "utf8")) as { version: string };

// Static TONAL for GitHub Pages (fleet pattern, as in Faro/Brizna): no server.
// The app is local-first — color engine + Closet live in localStorage; auth and
// database were OFF in Grok's build (.grok/app-env.json: VITE_AUTH_ENABLED=false,
// deploy.database=false). Studio's Grok server function runs through the
// start-shim and answers "AI is not available" without a key, as upstream.
export default defineConfig({
  root: "spa",
  base: "./",
  publicDir: r("./spa-public"),
  define: {
    "process.env.XAI_API_KEY": "undefined",
    __TONAL_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: [
      { find: /^@tanstack\/react-start$/, replacement: r("./src/spa/start-shim.ts") },
      { find: /^@tanstack\/react-start\/server$/, replacement: r("./src/spa/start-shim.ts") },
      { find: "@", replacement: r("./src") },
    ],
  },
  plugins: [
    {
      name: "tonal-spa-routes",
      enforce: "pre",
      resolveId(id, importer) {
        if (!importer || !importer.endsWith("routeTree.gen.ts")) return null;
        if (id === "./routes/__root") return r("./src/spa/root.tsx");
        return null;
      },
    },
    tailwindcss(),
    viteReact(),
  ],
  build: { outDir: "../docs", emptyOutDir: true, chunkSizeWarningLimit: 4000, target: "es2022" },
});
