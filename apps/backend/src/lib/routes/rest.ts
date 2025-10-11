import type { Hono } from "hono";
import { getLobbiesService, createNewLobby } from "../game/create";
import { parseCookie } from "../common/utils";
import { LOBBY_ID_COOKIE, PRIVATE_ID_COOKIE } from "shared";
import { HTTPException } from "hono/http-exception";
import { getPlayerByPrivateId, removePlayerFromLobby } from "../game/player";
import type { Lobby } from "../game/lobby";
import { setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

/**
 * Rest endpoints
 */
export default function setupRestEndpoints(app: Hono) {
  app.get("/getOrCreateLobbyById", (c) => {
    const lobbyId = c.req.query("lobbyId");
    const lobbies = getLobbiesService().lobbies;

    if (!lobbyId || !lobbies.has(lobbyId)) {
      const newLobby = createNewLobby(lobbies);
      const CHECK_WHETHER_PLAYER_IN_LOBBY_AFTER_MS = 10_000;
      setTimeout(() => {
        if (!isAnyPlayerInLobby(newLobby) && lobbies.has(newLobby.id)) {
          lobbies.delete(newLobby.id);
        }
      }, CHECK_WHETHER_PLAYER_IN_LOBBY_AFTER_MS);

      return c.json(newLobby.id);
    }

    return c.json(lobbies.get(lobbyId)!.id);
  });

  app.get("/isLobbyId", (c) => {
    const lobbyId = c.req.query("lobbyId");
    const lobbies = getLobbiesService().lobbies;

    console.log(lobbyId, lobbies.has(lobbyId!));

    if (!lobbyId || !lobbies.has(lobbyId))
      throw new HTTPException(404, { message: "Lobby with this ID does not exist" });

    return c.json({ message: "Success" });
  });

  app.get("/isValidPlayerInLobby", (c) => {
    const cookies = c.req.header().cookie;
    const [lobbyId, privateId] = parseCookie(cookies, LOBBY_ID_COOKIE, PRIVATE_ID_COOKIE);

    const lobby = getLobbiesService().lobbies.get(lobbyId!);
    if (!lobby)
      throw new HTTPException(400, { message: "Incorrect combination of lobby and private ids" });

    const player = getPlayerByPrivateId(lobby, privateId!);
    if (!player)
      throw new HTTPException(400, { message: "Incorrect combination of lobby and private ids" });

    return c.json({ message: "Success" }, 200);
  });

  app.get("/setCookies", (c) => {
    const lobbyId = c.req.query("lobbyId");
    const privateId = c.req.query("privateId");

    console.log("SET COOKIES", lobbyId, privateId);
    if (!lobbyId || !privateId) throw new HTTPException(400, { message: "Missing data" });

    // This makes sure that Chrome does not regard the cookie as session one
    setCookie(c, "lobbyId", lobbyId, getCookieOptionsForCrossSiteWithLongExpiration());
    setCookie(c, "privateId", privateId, getCookieOptionsForCrossSiteWithLongExpiration());

    return c.json({ message: "success" }, 200);
  });

  app.get("/ping", (c) => {
    return c.json("Musio server is running", 200);
  });
}

function isAnyPlayerInLobby(lobby: Lobby) {
  return lobby.players.length > 0;
}

function getCookieOptionsForCrossSiteWithLongExpiration(): CookieOptions {
  const hundredDays = 60 * 60 * 24 * 100;

  return {
    maxAge: hundredDays,
    expires: new Date(Date.now() + hundredDays * 1000),
    sameSite: "None",
    secure: true,
  };
}
