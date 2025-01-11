import type { WSContext } from "hono/ws";
import type { LobbiesMap, Lobby } from "./lobby";
import type { Player } from "shared";

export type PlayerServer = Omit<PlayerServerWithoutWS, "ws"> & {
  ws: WSContext<unknown>;
};

export type PlayerServerWithoutWS = Omit<
  Player,
  "icon" | "ws" | "isHost" | "isMe" | "isChecked"
> & {
  privateId: string;
  icon: string;
  ws?: never;
};

export function initPlayerToLobby(lobbies: LobbiesMap, lobbyId: string, player: PlayerServer) {
  console.log("Lobby: ", lobbyId);
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return;
  }

  lobby.players.push(player);
  console.log("Player joined", player);

  return player;
}

export function getPlayerByPrivateId(lobby: Lobby, privateId: string) {
  return lobby.players.find((player) => player.privateId === privateId);
}
