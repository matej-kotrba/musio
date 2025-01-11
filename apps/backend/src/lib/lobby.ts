import {
  messageToClientGameState,
  type GameState,
  type GameStateType,
  type GuessingGameState,
  type PickingGameState,
  type Song,
  type WS_MessageInterface,
  type WS_MessageMapClient,
} from "shared";
import type { LobbyMap } from "./map.js";
import { SONG_PICKING_DURATION } from "./constants.js";
import { shuffleArray } from "./utils.js";
import type { PlayerServer } from "./player.js";

export type LobbiesMap = LobbyMap<string, Lobby>;

export type Lobby = {
  id: string;
  stateProperties: GameState;
  players: PlayerServer[];
  leaderPlayerId?: string;
  data: {
    currentCounterTimeout?: AbortController;
    pickedSongs: Song[];
  };
};

export function changeLobbyState(lobby: Lobby, state: GameState) {
  lobby.stateProperties = state;
}

export function isLobbyState<T extends GameStateType>(
  props: GameState,
  condition: T
): props is Extract<typeof props, { state: T }> {
  return props.state === condition;
}

// export function getEventInLobby<T extends keyof MessageToClientGameState>(
//   lobbyState: T,
//   event: MessageToClientGameState[T][number]
// ) {
//   return event;
// }

type MessageToClientGameState = typeof messageToClientGameState;
type Messages = WS_MessageInterface<WS_MessageMapClient>[keyof WS_MessageMapClient];

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
  initialTimeRemainingInSec: SONG_PICKING_DURATION,
});

export const getInitialGuessingGameState: (songs: Song[]) => GuessingGameState = (songs) => ({
  state: "guessing",
  initialTimeRemaining: SONG_PICKING_DURATION,
  currentInitialTimeRemaining: SONG_PICKING_DURATION,
  currentSongIndex: 0,
  songsToGuessQueue: shuffleArray(songs),
});
