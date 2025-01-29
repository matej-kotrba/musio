import type { Hono } from "hono";
import { getLobbiesService, createNewLobby } from "../game/create";

/**
 * Rest endpoints
 */
export default function setupRestEndpoints(app: Hono) {
  app.get("/getLobbyId", (c) => {
    const lobbyId = c.req.query("lobbyId");
    const lobbies = getLobbiesService().lobbies;

    if (!lobbyId || !lobbies.has(lobbyId)) {
      const newLobby = createNewLobby(lobbies);

      return c.json(newLobby.id);
    }

    return c.json(lobbies.get(lobbyId)!.id);
  });
}
