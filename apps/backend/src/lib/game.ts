import { createNewMessageToClient, toPayloadToClient } from "shared";
import { POINTS_CALCULATION_BASE } from "./constants";
import type { Lobby } from "./lobby";
import type { PlayerServer } from "./player";
import { getLobbiesService } from "./create";

const playerGuessPositionBonus: Record<number, number> = {
  0: 5,
  1: 3,
  2: 1,
};

export function isHost(playerId: string, lobby: Lobby) {
  return lobby.leaderPlayerId === playerId;
}

export function getReceivedPoints(
  guessedPlayersLength: number,
  guessTimeInMs: number,
  guessingStartTimeInMs: number,
  guessingTimeLengthInMs: number
) {
  const positionBonus = playerGuessPositionBonus[guessedPlayersLength] ?? 0;
  const timeTaken = guessTimeInMs - guessingStartTimeInMs;

  // If the guess was made after the duration, return 0 points
  if (timeTaken > guessingTimeLengthInMs) return 0;

  // Calculate the percentage of time remaining
  const timeRemainingPercentage = 1 - timeTaken / guessingTimeLengthInMs;

  // Use square root to make the curve more gradual
  // This will make the point difference smaller between early and middle guesses
  const adjustedPercentage = Math.sqrt(timeRemainingPercentage);

  return Math.round(POINTS_CALCULATION_BASE * adjustedPercentage) + positionBonus;
}

export function handleChatMessage(
  player: PlayerServer,
  lobby: Lobby,
  { messageId, content }: { messageId: string; content: string }
) {
  player.ws.send(
    toPayloadToClient(
      lobby.id,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
        isOk: true,
        messageId,
        type: false,
      })
    )
  );

  getLobbiesService().lobbies.publish(
    lobby.id,
    player.privateId,
    toPayloadToClient(
      player.publicId,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE", {
        content: content,
      })
    )
  );
}
