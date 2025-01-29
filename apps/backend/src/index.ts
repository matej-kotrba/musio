import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { getLobbiesService, createNewLobby } from "./lib/game/create";
import setupDevEndpoints from "./lib/routes/dev";
import setupWsEndpoints from "./lib/routes/ws";

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

setupDevEndpoints(app);
setupWsEndpoints(app, upgradeWebSocket);

const port = 5173;
console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});
injectWebSocket(server);

/**
 * Rest endpoints
 */
app.get("/getLobbyId", (c) => {
  const lobbyId = c.req.query("lobbyId");
  const lobbies = getLobbiesService().lobbies;

  if (!lobbyId || !lobbies.has(lobbyId)) {
    const newLobby = createNewLobby(lobbies);

    return c.json(newLobby.id);
  }

  return c.json(lobbies.get(lobbyId)!.id);
});

export { app, upgradeWebSocket };
