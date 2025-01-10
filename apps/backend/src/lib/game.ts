import type { Lobby } from "./lobby";

export function isHost(playerId: string, lobby: Lobby) {
  return lobby.leaderPlayerId === playerId;
}
