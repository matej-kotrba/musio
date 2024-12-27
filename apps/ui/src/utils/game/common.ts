import { Player, PlayerServerWithoutWS } from "shared";

export function iconNameToDisplayName(icon: string) {
  return icon.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function playerServerToPlayer(player: PlayerServerWithoutWS): Player {
  return {
    id: player.id,
    name: player.name,
    icon: {
      url: `/avatars/${player.icon}.webp`,
      name: iconNameToDisplayName(player.icon),
    },
    points: player.points,
  };
}
