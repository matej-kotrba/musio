import { Player } from "~/components/lobby/Player";
import { getRandomId } from "./utils";

export type PlayerServer = Omit<Player, "icon"> & {
  icon: string;
};

export type Lobby = {
  id: string;
  players: PlayerServer[];
};

const lobbies = new Map<string, Lobby>();

export const getLobbies = () => lobbies;

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
