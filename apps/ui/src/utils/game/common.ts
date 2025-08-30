import {
  GameState,
  GameStateMap,
  GameStateType,
  ClientPlayer,
  ClientPlayerFromServer,
} from "shared";

export function iconNameToDisplayName(icon: string) {
  return icon.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function playerServerToPlayer(player: ClientPlayerFromServer): ClientPlayer {
  return {
    publicId: player.publicId,
    name: player.name,
    icon: {
      url: `/avatars/${player.icon}.webp`,
      name: iconNameToDisplayName(player.icon),
    },
    points: player.points,
    isHost: player.isHost,
    status: "connected",
  };
}

// Intended to be used in <Show> component
export function getGamePhaseIfValid<T extends GameStateMap[GameStateType]>(
  gameState: GameState,
  phase: T["state"]
) {
  if (gameState.state === phase) return gameState as T;
  return false;
}
