import { POINTS_CALCULATION_BASE } from "../common/constants";
import type { Lobby } from "./lobby";

const playerGuessPositionBonus: Record<number, number> = {
  0: 5,
  1: 3,
  2: 1,
};

export function isHost(playerId: string, lobby: Lobby) {
  return lobby.leaderPlayerId === playerId;
}

export function getReceivedPoints({
  guessedPlayersLength,
  guessTimeInMs,
  guessingStartTimeInMs,
  guessingTimeLengthInMs,
  currentPlayerWhoPickedPoints,
}: {
  guessedPlayersLength: number;
  guessTimeInMs: number;
  guessingStartTimeInMs: number;
  guessingTimeLengthInMs: number;
  currentPlayerWhoPickedPoints: number;
}): {
  forGuesser: number;
  forPlayerWhoPicked: number;
} {
  const positionBonus = playerGuessPositionBonus[guessedPlayersLength] ?? 0;
  const timeTaken = guessTimeInMs - guessingStartTimeInMs;

  // If the guess was made after the duration, return 0 points
  if (timeTaken > guessingTimeLengthInMs)
    return {
      forGuesser: 0,
      forPlayerWhoPicked: 0,
    };

  // Calculate the percentage of time remaining
  const timeRemainingPercentage = 1 - timeTaken / guessingTimeLengthInMs;

  // Use square root to make the curve more gradual
  // This will make the point difference smaller between early and middle guesses
  const adjustedPercentage = Math.sqrt(timeRemainingPercentage);
  const guesserFinalPoints =
    Math.round(POINTS_CALCULATION_BASE * adjustedPercentage) + positionBonus;

  return {
    forGuesser: guesserFinalPoints,
    forPlayerWhoPicked: currentPlayerWhoPickedPoints === 0 ? guesserFinalPoints - 1 : 1,
  };
}
