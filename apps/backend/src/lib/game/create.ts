import type { WSContext } from "hono/ws";
import type { Lobby } from "./lobby";
import { getRandomId } from "../common/utils";
import type { Song } from "shared";
import type { PlayerServer } from "./player";
import { DEFAULT_POINTS_LIMIT } from "../common/constants";

export class LobbyMap<K extends string, V extends Lobby> extends Map<K, V> {
  publish(lobbyId: K, senderId: string, message: string) {
    const lobby = this.get(lobbyId);
    if (!lobby) return;

    lobby.players.forEach((player) => {
      if (player.privateId === senderId) return;
      player.ws.send(message);
    });
  }

  broadcast(lobbyId: K, message: string) {
    const lobby = this.get(lobbyId);
    if (!lobby) return;

    lobby.players.forEach((player) => {
      player.ws.send(message);
    });
  }
}

export type LobbiesMap = LobbyMap<string, Lobby>;

class LobbiesService {
  static #instance: LobbiesService;
  #lobbies!: LobbiesMap;

  constructor() {
    if (!LobbiesService.#instance) {
      LobbiesService.#instance = this;
      this.#lobbies = new LobbyMap<string, Lobby>();
    }

    return LobbiesService.#instance;
  }

  get lobbies() {
    return this.#lobbies;
  }
}

export const getLobbiesService = () => new LobbiesService();

export function createNewLobby(lobbies: LobbiesMap) {
  const id = getRandomId();
  const lobby = {
    id,
    stateProperties: {
      state: "lobby",
      type: "INITIAL",
    },
    players: [],
    data: {
      pickedSongs: [],
      songQueue: [],
      currentSongIndex: 0,
    },
    options: {
      toPointsLimit: 20,
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
    status: "connected",
    points: points ?? 0,
  };
}

export function createNewSong(
  songName: string,
  artist: string,
  trackUrl: string,
  imageUrl: string,
  fromPlayerById: string
): Song {
  return {
    name: songName,
    artist,
    trackUrl,
    imageUrl100x100: imageUrl,
    fromPlayerByPublicId: fromPlayerById,
  };
}
