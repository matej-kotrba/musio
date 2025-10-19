import type { WSContext } from "hono/ws";
import type { Lobby } from "./lobby";
import type { ClientPlayer, Player, ClientPlayerFromServer } from "shared";
import type { LobbiesMap } from "./create";
import { isHost } from "./game-utils";

export type PlayerServerOnlyProperties = {
  privateId: string;
  ws: WSContext<unknown>;
  lastSentMessage: Date;
};

export type PlayerServer = Omit<ClientPlayerFromServer, "isHost" | "isChecked"> &
  PlayerServerOnlyProperties;

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

  const removedPlayer = { ...lobby.players[indexOfPlayer] };
  lobby.players.splice(indexOfPlayer, 1);

  return removedPlayer;
}

export function convertServerPlayerToClientPlayer(
  lobby: Lobby,
  player: PlayerServer
): ClientPlayerFromServer {
  return {
    name: player.name,
    icon: player.icon,
    isHost: isHost(player.privateId, lobby),
    points: player.points,
    publicId: player.publicId,
    connectionStatus: player.connectionStatus,
  };
}
