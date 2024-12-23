import type {
  WS_MESSAGE,
  WS_MESSAGE_TO_CLIENT_TYPE,
  WS_MESSAGE_TO_SERVER_TYPE,
  WS_MessageInterface,
  WS_MessageMapClient,
  WS_MessageMapServer,
} from "./types/messages";

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
