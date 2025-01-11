import type { WSContext } from "hono/ws";
import type { LobbiesMap, Lobby, PlayerServer } from "./lobby";
import { getRandomId } from "./utils";
import type { Song } from "shared";

export function createNewLobby(lobbies: LobbiesMap) {
  const id = getRandomId();
  const lobby = {
    id,
    stateProperties: {
      state: "lobby",
    },
    players: [],
    data: {
      pickedSongs: [],
    },
  } satisfies Lobby;

  lobbies.set(id, lobby);
  return lobby;
}

export function createNewPlayer(
  ws: WSContext<unknown>,
  privateId: string,
  publicId: string,
  name: string,
  icon: string,
  points?: number
): PlayerServer {
  return {
    ws,
    privateId,
    publicId,
    name,
    icon,
    points: points ?? 0,
  };
}

export function createNewSong(
  songName: string,
  artist: string,
  trackUrl: string,
  fromPlayerById: string
): Song {
  return {
    name: songName,
    artist,
    trackUrl,
    fromPlayerById,
  };
}
