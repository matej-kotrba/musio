import { defineConfig } from "vite";
import build from "@hono/vite-build/node";

export default defineConfig({
  plugins: [
    build({
      // Defaults are `src/index.ts`,`./src/index.tsx`,`./app/server.ts`
      entry: "./src/index.ts",
      // port option is only for Node.js adapter. Default is 3000
      port: 8888,
    }),
  ],
  build: {
    rollupOptions: {
      external: ["@hono/node-ws"], // Exclude this module from bundling
    },
  },
});
