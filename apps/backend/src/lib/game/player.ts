import type { WSContext } from "hono/ws";
import type { Lobby } from "./lobby";
import type { Player } from "shared";
import type { LobbiesMap } from "./create";

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

export function getPlayerByWs(lobby: Lobby, playerWs: WSContext<unknown>) {
  const playerIndex = lobby.players.findIndex((player) => player.ws === playerWs);

  return playerIndex === -1 ? undefined : lobby.players[playerIndex];
}

export function getPlayerByPrivateId(lobby: Lobby, privateId?: string) {
  return lobby.players.find((player) => player.privateId === privateId);
}

export function removePlayerFromLobby(lobby: Lobby, playerPrivateId: string) {
  const indexOfPlayer = lobby.players.findIndex((player) => player.privateId === playerPrivateId);
  if (indexOfPlayer === -1) return;

  const removedPlayer = {...lobby.players[indexOfPlayer]};
  lobby.players.splice(indexOfPlayer, 1);

  return removedPlayer;
}
