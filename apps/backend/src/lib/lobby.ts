import type {
  fromMessage,
  GameState,
  GameStateType,
  GuessingGameState,
  LeaderboardGameState,
  LobbyGameState,
  messageToClientGameState,
  PickingGameState,
  Player,
  WS_MESSAGE_TO_CLIENT_TYPE,
  WS_MessageMapClient,
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

export function isLobbyState<T extends GameState>(
  props: GameState,
  condition: GameStateType
): props is T {
  return props.state === condition;
}

type MessageToClientGameState = typeof messageToClientGameState;

export function getEventInLobby<T extends keyof MessageToClientGameState>(
  lobbyState: T,
  event: MessageToClientGameState[T][number]
) {
  return event;
}

// type A = typeof messageToClientGameState;

// export function isMessageType<T extends keyof A, K extends A[T][number]>(
//   lobbyState: T,
//   messageType: WS_MESSAGE_TO_CLIENT_TYPE,
//   targetMessageType: K
// ): messageType is K {
//   return messageType === targetMessageType;
// }

// isMessageType("lobby", "", "START_GAME")

// export function isPayloadMessageType(
//   message: ReturnType<typeof fromMessage<WS_MessageMapClient>>,
//   type: WS_MESSAGE_TO_CLIENT_TYPE
// ): message is  {}

export const getInitialPickingGameState: () => PickingGameState = () => ({
  state: "picking",
  playersWhoPickedIds: [],
  initialTimeRemaining: SONG_PICKING_DURATION,
});
