import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    experimental: {
      websocket: true,
    },
  },
}).addRouter({
  name: "_ws",
  type: "http",
  handler: "./src/server/ws.ts",
  target: "server",
  base: "/_ws",
});
