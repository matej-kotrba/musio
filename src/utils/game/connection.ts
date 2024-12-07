type WS_MessageMapToServer = {
  PLAYER_INIT: {
    name: string;
    icon: string;
  };
  PICK_SONG: {
    song: string;
  };
  REDIRECT_TO_LOBBY: {
    lobbyId: string;
  };
};

type WS_MessageMapToClient = {
  PLAYER_INITS: {
    name: string;
    icon: string;
    points: number;
  };
};

type WS_MESSAGE = WS_MessageMapToServer | WS_MessageMapToClient;

export const WS_MESSAGE_TO_SERVER: (keyof WS_MessageMapToServer)[] = [
  "PLAYER_INIT",
  "PICK_SONG",
  "REDIRECT_TO_LOBBY",
] as const;
export const WS_MESSAGE_TO_CLIENT: (keyof WS_MessageMapToClient)[] = [
  "PLAYER_INITS",
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

export function createNewMessage<R extends WS_MESSAGE, T extends keyof R>(
  lobbyId: string,
  type: T,
  payload: R[T]
): WS_MessageInterface<R>[T] {
  return {
    type,
    payload,
    lobbyId,
  } as WS_MessageInterface<R>[T];
}

export function fromMessage<T extends WS_MESSAGE>(seriliazedMessage: string) {
  return JSON.parse(seriliazedMessage) as {
    user: string;
    message: T[keyof T];
  };
}
