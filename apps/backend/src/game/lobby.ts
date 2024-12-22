import type { Player } from "shared/index.types.ts";
import { getRandomId } from "./utils.js";

export type PlayerServer = Omit<Player, "icon"> & {
  icon: string;
};

export type Lobby = {
  id: string;
  players: PlayerServer[];
};

export function initPlayerToLobby(lobbyId: string, player: PlayerServer) {
  console.log("Lobby: ", lobbyId);
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return;
  }

  lobby.players.push(player);
  console.log("Player joined", player);

  return player;
}

function createNewPlayer(
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

export function createNewLobby() {
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
