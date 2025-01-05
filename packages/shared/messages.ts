import type { GameStateType } from "./index.types";
import type {
  WS_MESSAGE,
  WS_MESSAGE_TO_CLIENT_TYPE,
  WS_MESSAGE_TO_SERVER_TYPE,
  WS_MessageInterface,
  WS_MessageMapClient,
  WS_MessageMapServer,
} from "./types/messages";

export const messageToClientGameState: Record<
  GameStateType,
  WS_MESSAGE_TO_CLIENT_TYPE[]
> = {
  lobby: ["START_GAME"],
  guessing: [],
  picking: ["PICK_SONG"],
  leaderboard: [],
} as const;

type PayloadData<T> = { userId: string; message: T };

const toPayload = <T extends () => unknown>(
  from: string,
  message: ReturnType<T>
) =>
  JSON.stringify({ userId: from, message: message } satisfies PayloadData<
    ReturnType<T>
  >);

export const toPayloadToClient = (
  from: string,
  message: ReturnType<typeof createNewMessageToClient>
) => toPayload(from, message);

export const toPayloadToServer = (
  from: string,
  message: ReturnType<typeof createNewMessageToServer>
) => toPayload(from, message);

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

export function fromMessage<T extends WS_MESSAGE>(seriliazedMessage: string) {
  return JSON.parse(seriliazedMessage) as PayloadData<
    WS_MessageInterface<T>[keyof T]
  >;
}
