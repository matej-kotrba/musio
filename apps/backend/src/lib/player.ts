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

export function removePlayerFromLobby(lobby: Lobby, playerWs: WSContext<unknown>) {
  const playerIndex = lobby.players.findIndex((player) => player.ws === playerWs);
  const removedPlayer = lobby.players[playerIndex];

  if (playerIndex === -1) {
    return;
  }

  lobby.players.splice(playerIndex, 1);

  return removedPlayer;
}

export function getPlayerByPrivateId(lobby: Lobby, privateId: string) {
  return lobby.players.find((player) => player.privateId === privateId);
}
