import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    server: {
      cors: true,
      proxy: {
        "/ws": {
          target: "ws://localhost:5173",
          ws: true,
          // changeOrigin: true,
          // secure: false
          rewriteWsOrigin: true,
          // Uncomment if needed for debugging
          // configure: (proxy, _options) => {
          //   proxy.on("error", (err) => {
          //     console.log("proxy error", err);
          //   });
          //   proxy.on("proxyReq", (proxyReq, req) => {
          //     console.log("Sending Request:", req.method, req.url);
          //   });
          //   proxy.on("proxyRes", (proxyRes) => {
          //     console.log("Got Response:", proxyRes.statusCode);
          //   });
          //   proxy.on("upgrade", (req, socket, head) => {
          //     console.log("WebSocket Upgrade:", req.url);
          //   });
          //   proxy.on("open", () => {
          //     console.log("WebSocket OPEN");
          //   });
          // },
        },
      },
    },
  },
  // server: {
  //   experimental: {
  //     websocket: true,
  //   },
  // },
});
// .addRouter({
//   name: "ws",
//   type: "http",
//   handler: "ws://localhost:5173/ws",
//   target: "server",
//   base: "/ws",
//   plugins: () => [tsconfigPaths()],
// });
