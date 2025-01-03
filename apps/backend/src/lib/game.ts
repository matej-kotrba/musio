import {
  messageToClientGameState,
  type GameStateType,
  type WS_MESSAGE_TO_CLIENT_TYPE,
} from "shared";
import type { Lobby } from "./lobby";

export function isMessageTypeForGameState(
  gameState: GameStateType,
  messageType: WS_MESSAGE_TO_CLIENT_TYPE
) {
  return messageToClientGameState[gameState].includes(messageType);
}

export function isHost(playerId: string, lobby: Lobby) {
  return lobby.leaderPlayerId === playerId;
}
