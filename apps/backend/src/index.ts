import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import setupDevEndpoints from "./lib/routes/dev";
import setupWsEndpoints from "./lib/routes/ws";
import setupRestEndpoints from "./lib/routes/rest";
import { cors } from "hono/cors";

console.log(process.env.ENV);
const portEnv = Number(process.env.PORT!);
const port = isNaN(portEnv) ? 5173 : portEnv;

const app = new Hono();

app.use("*", cors({ origin: process.env.UI_URL, credentials: true }));

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

setupDevEndpoints(app);
setupWsEndpoints(app, upgradeWebSocket);
setupRestEndpoints(app);

console.log(
  `Server is running on http://localhost:${port} with UI requests excepting from ${process.env.UI_URL}`
);
const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);

export default app;
