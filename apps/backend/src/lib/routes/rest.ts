import type { Hono } from "hono";
import { getLobbiesService, createNewLobby } from "../game/create";
import { parseCookie } from "../common/utils";
import { LOBBY_ID_COOKIE, PRIVATE_ID_COOKIE } from "shared";
import { HTTPException } from "hono/http-exception";
import { getPlayerByPrivateId } from "../game/player";

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

  app.get("/isLobbyId", (c) => {
    const lobbyId = c.req.query("lobbyId")
    const lobbies = getLobbiesService().lobbies

    if (!lobbyId || !lobbies.has(lobbyId)) throw new HTTPException(404, {message: "Lobby with this ID does not exist"})

    return c.json({message: "Success"})
  })

  app.get("/isValidPlayerInLobby", (c) => {
    const cookies = c.req.header().cookie
    const [lobbyId, privateId] = parseCookie(cookies, LOBBY_ID_COOKIE, PRIVATE_ID_COOKIE)

    const lobby = getLobbiesService().lobbies.get(lobbyId!);
    if (!lobby) throw new HTTPException(400, {message: "Incorrect combination of lobby and private ids"})

      const player = getPlayerByPrivateId(lobby, privateId!)
    if (!player) throw new HTTPException(400, {message: "Incorrect combination of lobby and private ids"})

    return c.json({ message: "Success" }, 200)
  })
}
