import type {
  GameState,
  GameStateType,
  messageToClientGameState,
  WS_MESSAGE_TO_CLIENT_TYPE,
  WS_MessageInterface,
  WS_MessageMapClient,
} from "shared";

type MessageToClientGameState = typeof messageToClientGameState;
type Messages = WS_MessageInterface<WS_MessageMapClient>[keyof WS_MessageMapClient];

export class EventHandleService {
  #messageEventType?: WS_MESSAGE_TO_CLIENT_TYPE;

  public isLobbyState<T extends GameStateType>(
    props: GameState,
    condition: T
  ): props is Extract<typeof props, { state: T }> {
    return props.state === condition;
  }

  public isMessageType<
    T extends keyof MessageToClientGameState,
    K extends MessageToClientGameState[T][number]
  >(
    lobbyState: T,
    message: Messages,
    targetMessageType: K
  ): message is Extract<Messages, { type: K }> {
    if (message.type === targetMessageType) {
      this.#messageEventType = targetMessageType;
      return true;
    }
    return false;
  }

  public getMessageEventType() {
    return this.#messageEventType;
  }

  public reset() {
    this.#messageEventType = undefined;
  }
}
