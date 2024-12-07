export type WS_MessageMapServer = {
  PLAYER_INIT: {
    name: string;
    icon: string;
    points: number;
  };
  PICK_SONG: {
    song: string;
  };
  REDIRECT_TO_LOBBY: {
    lobbyId: string;
  };
};

export type WS_MessageMapClient = {
  PLAYER_INIT: {
    name: string;
    icon: string;
  };
};

type WS_MESSAGE = WS_MessageMapServer | WS_MessageMapClient;

export const WS_MESSAGE_TO_SERVER: (keyof WS_MessageMapServer)[] = [
  "PLAYER_INIT",
  "PICK_SONG",
  "REDIRECT_TO_LOBBY",
] as const;
export const WS_MESSAGE_TO_CLIENT: (keyof WS_MessageMapClient)[] = [
  "PLAYER_INIT",
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

function createNewMessage<R extends WS_MESSAGE, T extends keyof R>(
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

export const createNewMessageToClient = createNewMessage<
  WS_MessageMapServer,
  WS_MESSAGE_TO_SERVER_TYPE
>;
export const createNewMessageToServer = createNewMessage<
  WS_MessageMapClient,
  WS_MESSAGE_TO_CLIENT_TYPE
>;

export function fromMessage<T extends WS_MESSAGE>(seriliazedMessage: string) {
  return JSON.parse(seriliazedMessage) as {
    user: string;
    message: WS_MessageInterface<T>[keyof T];
  };
}
