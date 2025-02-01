import { GameState, GameStateMap, GameStateType, Player, PlayerFromServer } from "shared";

export function iconNameToDisplayName(icon: string) {
  return icon.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function playerServerToPlayer(player: PlayerFromServer): Player {
  return {
    publicId: player.publicId,
    name: player.name,
    icon: {
      url: `/avatars/${player.icon}.webp`,
      name: iconNameToDisplayName(player.icon),
    },
    points: player.points,
    isHost: player.isHost,
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
