import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import setupDevEndpoints from "./lib/routes/dev";
import setupWsEndpoints from "./lib/routes/ws";
import setupRestEndpoints from "./lib/routes/rest";
import { isDev } from "./lib/common/utils";
import { cors } from "hono/cors";

const app = new Hono();
app.use("*", cors({ origin: "http://localhost:3000", credentials: true }));
const port = 5173;
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

if (isDev()) setupDevEndpoints(app);
setupWsEndpoints(app, upgradeWebSocket);
setupRestEndpoints(app);

console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});
injectWebSocket(server);
