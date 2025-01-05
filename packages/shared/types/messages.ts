import type { GameState } from "./lobby";
import { PlayerFromServer } from "./player";

export type WS_MessageMapServer = {
  PLAYER_INIT: { allPlayers: PlayerFromServer[]; thisPlayerId: string };
  PLAYER_JOIN: PlayerFromServer;
  CHANGE_GAME_STATE: {
    properties: GameState;
  };
};

export type WS_MessageMapClient = {
  PICK_SONG: {
    song: string;
  };
  START_GAME: {};
};

export type WS_MESSAGE = WS_MessageMapServer | WS_MessageMapClient;

export type WS_MESSAGE_TO_SERVER_TYPE = keyof WS_MessageMapServer;
export type WS_MESSAGE_TO_CLIENT_TYPE = keyof WS_MessageMapClient;

export type WS_MessageInterface<T extends WS_MESSAGE> = {
  [Key in keyof T]: {
    type: Key;
    payload: T[Key];
    lobbyId: string;
  };
};
