import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // vite: {
  //   server: {
  //     cors: true,
  //     proxy: {
  //       "/ws": {
  //         target: "ws://localhost:5173",
  //         ws: true,
  //         rewriteWsOrigin: true,
  //       },
  //     },
  //   },
  // },
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
