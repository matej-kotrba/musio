import type { Player } from "shared";
import { getRandomId } from "./utils.js";
import type { WSContext } from "hono/ws";
import type { LobbyMap } from "./map.js";

export type PlayerServer = Omit<Player, "icon"> & {
  ws: WSContext<unknown>;
  icon: string;
};

export type LobbiesMap = LobbyMap<string, Lobby>;

export type Lobby = {
  id: string;
  players: PlayerServer[];
};

export function initPlayerToLobby(
  lobbies: LobbiesMap,
  lobbyId: string,
  player: PlayerServer
) {
  console.log("Lobby: ", lobbyId);
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return;
  }

  lobby.players.push(player);
  console.log("Player joined", player);

  return player;
}

export function createNewPlayer(
  ws: WSContext<unknown>,
  id: string,
  name: string,
  icon: string,
  points?: number
): PlayerServer {
  return {
    ws,
    id,
    name,
    icon,
    points: points ?? 0,
  };
}

export function createNewLobby(lobbies: LobbiesMap) {
  const id = getRandomId();
  const lobby = {
    id,
    players: [],
  };

  lobbies.set(id, lobby);
  return lobby;
}
