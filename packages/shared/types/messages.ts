import type { messageConfig } from "../messages";
import type { GameState } from "./lobby";
import { PlayerFromServer } from "./player";

export type WS_MessageMapServer = {
  PLAYER_INIT: {
    allPlayers: PlayerFromServer[];
    thisPlayerPublicId: string;
    thisPlayerPrivateId: string;
  };
  PLAYER_JOIN: PlayerFromServer;
  CHANGE_GAME_STATE: {
    properties: GameState;
  };
  PLAYER_PICKED_SONG: {};
};

export type WS_MessageMapClient = {
  [State in keyof typeof messageConfig as keyof (typeof messageConfig)[State]]: (typeof messageConfig)[State][keyof (typeof messageConfig)[State]];
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
