import type { Player } from "shared";
import { getRandomId } from "./utils.js";

export type PlayerServer = Omit<Player, "icon"> & {
  icon: string;
};

export type LobbiesMap = Map<string, Lobby>;

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
  id: string,
  name: string,
  icon: string,
  points?: number
): PlayerServer {
  return {
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

export function getLobbyIdFromPeer(peer: { url: string }) {
  const url = new URLSearchParams(peer.url.split("?")[1]);
  return url.get("id");
}
