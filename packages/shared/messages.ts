import type { GameState, GameStateType, LobbyGameState, Song } from "./index.types";
import type {
  WS_MESSAGE,
  WS_MESSAGE_TO_CLIENT_TYPE,
  WS_MESSAGE_TO_SERVER_TYPE,
  WS_MessageInterface,
  WS_MessageMapClient,
  WS_MessageMapServer,
} from "./types/messages";

export const messageConfig = {
  lobby: {
    START_GAME: {} as {},
    CHANGE_GAME_LIMIT: {} as { newLimit: number },
  },
  picking: {
    PICK_SONG: {} as Omit<Song, "fromPlayerByPublicId">,
  },
  guessing: {
    CHAT_MESSAGE: {} as { content: string; messageId: string },
  },
  leaderboard: {
    BACK_TO_LOBBY: {} as {},
  },
  all: {
    CHAT_MESSAGE: {} as { content: string; messageId: string },
  },
} as const;

export const messageToClientGameState = Object.fromEntries(
  Object.entries(messageConfig).map(([key, value]) => [key, Object.keys(value)])
) as {
  [K in keyof typeof messageConfig]: (keyof (typeof messageConfig)[K])[];
};

type IdType = "publicId" | "privateId";
type PayloadData<T, R extends IdType> = { [Type in R]: string } & { message: T };

const toPayload = <T extends () => unknown, R extends IdType>(
  from: string,
  message: ReturnType<T>,
  idType: R
) => JSON.stringify({ [idType]: from, message: message } as PayloadData<ReturnType<T>, R>);

export const toPayloadToClient = (
  from: string,
  message: ReturnType<typeof createNewMessageToClient>
) => toPayload(from, message, "publicId");

export const toPayloadToServer = (
  from: string,
  message: ReturnType<typeof createNewMessageToServer>
) => toPayload(from, message, "privateId");

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

export function createNewMessageToClient<T extends WS_MESSAGE_TO_SERVER_TYPE>(
  lobbyId: string,
  type: T,
  payload: WS_MessageMapServer[T]
) {
  return createNewMessage<WS_MessageMapServer, T>(lobbyId, type, payload);
}

export function createNewMessageToServer<T extends WS_MESSAGE_TO_CLIENT_TYPE>(
  lobbyId: string,
  type: T,
  payload: WS_MessageMapClient[T]
) {
  return createNewMessage<WS_MessageMapClient, T>(lobbyId, type, payload);
}

function fromMessage<T extends WS_MESSAGE, R extends IdType>(serializedMessage: string) {
  return JSON.parse(serializedMessage) as PayloadData<WS_MessageInterface<T>[keyof T], R>;
}

export function fromMessageOnClient(serializedMessage: string) {
  return fromMessage<WS_MessageMapServer, "publicId">(serializedMessage);
}

export function fromMessageOnServer(serializedMessage: string) {
  return fromMessage<WS_MessageMapClient, "privateId">(serializedMessage);
}

export type FromMessageOnServer = ReturnType<typeof fromMessageOnServer>;
export type FromMessageOnServerByStateType<T extends GameState["state"]> = Omit<
  FromMessageOnServer,
  "message"
> & {
  message: {
    [K in keyof (typeof messageConfig)[T]]: {
      type: K;
      payload: (typeof messageConfig)[T][K];
      lobbyId: string;
    };
  }[keyof (typeof messageConfig)[T]];
};

// const a: FromMessageOnServerByStateType<"lobby"> = {
//   message: { type: "START_GAME", payload: {}, lobbyId: "1" },
//   privateId: "1",
// };
