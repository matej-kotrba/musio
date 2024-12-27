import type { PlayerServerWithoutWS } from "./player";

export type WS_MessageMapServer = {
  PLAYER_INIT: PlayerServerWithoutWS & {
    allPlayers: PlayerServerWithoutWS[];
  };
  PLAYER_JOIN: PlayerServerWithoutWS;
};

export type WS_MessageMapClient = {
  PICK_SONG: {
    song: string;
  };
};

export type WS_MESSAGE = WS_MessageMapServer | WS_MessageMapClient;

export const WS_MESSAGE_TO_SERVER: (keyof WS_MessageMapServer)[] = [
  "PLAYER_INIT",
  "PLAYER_JOIN",
] as const;
export const WS_MESSAGE_TO_CLIENT: (keyof WS_MessageMapClient)[] = [
  "PICK_SONG",
];

export type WS_MESSAGE_TO_SERVER_TYPE = (typeof WS_MESSAGE_TO_SERVER)[number];
export type WS_MESSAGE_TO_CLIENT_TYPE = (typeof WS_MESSAGE_TO_CLIENT)[number];

export type WS_MessageInterface<T extends WS_MESSAGE> = {
  [Key in keyof T]: {
    type: Key;
    payload: T[Key];
    lobbyId: string;
  };
};
