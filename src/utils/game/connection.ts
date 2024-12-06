type WS_MessageMap = {
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

export const WS_MESSAGE: (keyof WS_MessageMap)[] = [
  "PLAYER_INIT",
  "PICK_SONG",
  "REDIRECT_TO_LOBBY",
] as const;
export type WS_MESSAGE_TYPE = (typeof WS_MESSAGE)[number];

export type WS_MessageInterface = {
  [Key in keyof WS_MessageMap]: {
    type: Key;
    payload: WS_MessageMap[Key];
    lobbyId: string;
  };
};

export function createNewMessage<T extends WS_MESSAGE_TYPE>(
  lobbyId: string,
  type: T,
  payload: WS_MessageMap[T]
): WS_MessageInterface[T] {
  return {
    type,
    payload,
    lobbyId,
  } as WS_MessageInterface[T];
}
