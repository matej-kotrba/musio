import { serve } from "@hono/node-server";
import { Hono } from "hono";
// import { createNodeWebSocket } from "@hono/node-ws";
import type { Lobby } from "./game/lobby.js";

const app = new Hono();

const lobbies = new Map<string, Lobby>();

app.get("/", (c) => {
  return c.json("Hello Hono!");
});

app.get("/getLobbyURL", (c) => {
  return c.json("/lobby/123");
});

const port = 5173;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
