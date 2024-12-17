import { Player } from "~/components/lobby/Player";

export type PlayerServer = Omit<Player, "icon"> & {
  icon: string;
};

export type Lobby = {
  id: string;
  players: PlayerServer[];
};

export const lobbies = new Map<string, Lobby>();
