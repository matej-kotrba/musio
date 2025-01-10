import {
  messageToClientGameState,
  type fromMessage,
  type GameState,
  type GameStateType,
  type GuessingGameState,
  type LeaderboardGameState,
  type LobbyGameState,
  type PickingGameState,
  type Player,
  type WS_MESSAGE_TO_CLIENT_TYPE,
  type WS_MessageInterface,
  type WS_MessageMapClient,
} from "shared";
import { getRandomId } from "./utils.js";
import type { WSContext } from "hono/ws";
import type { LobbyMap } from "./map.js";
import { SONG_PICKING_DURATION } from "./constants.js";

export type PlayerServer = Omit<PlayerServerWithoutWS, "ws"> & {
  ws: WSContext<unknown>;
};

export type PlayerServerWithoutWS = Omit<
  Player,
  "icon" | "ws" | "isHost" | "isMe"
> & {
  privateId: string;
  icon: string;
  ws?: never;
};

export type LobbiesMap = LobbyMap<string, Lobby>;

export type Lobby = {
  id: string;
  stateProperties: GameState;
  players: PlayerServer[];
  leaderPlayerId?: string;
};

export function initPlayerToLobby(
  lobbies: LobbiesMap,
  lobbyId: string,
  player: PlayerServer
) {
  console.log("Lobby: ", lobbyId);
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return;
  }

  lobby.players.push(player);
  console.log("Player joined", player);

  return player;
}

export function createNewPlayer(
  ws: WSContext<unknown>,
  privateId: string,
  publicId: string,
  name: string,
  icon: string,
  points?: number
): PlayerServer {
  return {
    ws,
    privateId,
    publicId,
    name,
    icon,
    points: points ?? 0,
  };
}

export function createNewLobby(lobbies: LobbiesMap) {
  const id = getRandomId();
  const lobby = {
    id,
    stateProperties: {
      state: "lobby",
    },
    players: [],
  } satisfies Lobby;

  lobbies.set(id, lobby);
  return lobby;
}

export function changeLobbyState(lobby: Lobby, state: GameState) {
  lobby.stateProperties = state;
}

export function isLobbyState<T extends GameStateType>(
  props: GameState,
  condition: T
): props is Extract<typeof props, { state: T }> {
  return props.state === condition;
}

// type A = MessageToClientGameState[keyof MessageToClientGameState][number];

// export function idk<T extends A, K extends keyof MessageToClientGameState>(
//   state: T,
//   lobbyType: K
// ): state is MessageToClientGameState[K][number] extends T ? T : never {
//   return messageToClientGameState[lobbyType].includes(state as never);
// }

// idk("PICK_SONG", "lobby");

// export function getEventInLobby<T extends keyof MessageToClientGameState>(
//   lobbyState: T,
//   event: MessageToClientGameState[T][number]
// ) {
//   return event;
// }

type MessageToClientGameState = typeof messageToClientGameState;
type Messages =
  WS_MessageInterface<WS_MessageMapClient>[keyof WS_MessageMapClient];

export function isMessageType<
  T extends keyof MessageToClientGameState,
  K extends MessageToClientGameState[T][number]
>(
  lobbyState: T,
  message: Messages,
  targetMessageType: K
): message is Extract<Messages, { type: K }> {
  return message.type === targetMessageType;
}

export const getInitialPickingGameState: () => PickingGameState = () => ({
  state: "picking",
  playersWhoPickedIds: [],
  initialTimeRemaining: SONG_PICKING_DURATION,
});
