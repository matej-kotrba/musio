import {
  messageToClientGameState,
  type GameStateType,
  type WS_MESSAGE_TO_CLIENT_TYPE,
} from "shared";

export function isMessageTypeForGameState(
  gameState: GameStateType,
  messageType: WS_MESSAGE_TO_CLIENT_TYPE
) {
  return messageToClientGameState[gameState].includes(messageType);
}
