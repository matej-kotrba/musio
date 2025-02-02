import {
  createNewMessageToClient,
  toPayloadToClient,
  type GameState,
  type GameStateMap,
  type GameStateType,
  type GuessingGameState,
  type LeaderboardGameState,
  type PickingGameState,
  type Song,
} from "shared";
import { INITIAL_GUESSING_DELAY_IN_MS, SONG_PICKING_DURATION_IN_SEC } from "../common/constants.js";
import { type PlayerServer } from "./player.js";
import type { LobbiesMap } from "./create.js";
import { abortLobbyTimeoutSignalAndRemoveIt, shuffleArray } from "../common/utils.js";

export type Lobby<T extends GameState["state"] | undefined = undefined> = {
  [Key in keyof GameStateMap]: {
    id: string;
    stateProperties: GameStateMap[Key];
    players: PlayerServer[];
    leaderPlayerId?: string;
    data: {
      currentTimeoutAbortController?: AbortController;
      pickedSongs: Song[];
      songQueue: Song[];
      songQueueGenerator?: Generator;
      currentSongIndex: number;
    };
  };
}[T extends undefined ? GameStateType : T];

type InitialGamePhaseData<T extends GameState> = {
  gameState: T;
  lobbyData: { [Key in keyof Lobby["data"]]?: Lobby["data"][Key] };
};

export function isLobbyState<T extends GameStateType>(
  lobby: Lobby,
  condition: T
): lobby is Extract<Lobby, { stateProperties: { state: T } }> {
  return lobby.stateProperties.state === condition;
}

export function changeLobbyStateOnServer(lobby: Lobby, state: InitialGamePhaseData<GameState>) {
  lobby.stateProperties = state.gameState;
  lobby.data = { ...lobby.data, ...state.lobbyData };
}

export function changeToLobbyState(
  lobby: Lobby,
  lobbies: LobbiesMap,
  initialGameState: InitialGamePhaseData<GameState>,
  callback?: () => void
) {
  abortLobbyTimeoutSignalAndRemoveIt(lobby);
  changeLobbyStateOnServer(lobby, initialGameState);

  lobbies.broadcast(
    lobby.id,
    toPayloadToClient(
      "server",
      createNewMessageToClient(lobby.id, "CHANGE_GAME_STATE", {
        properties: lobby.stateProperties,
      })
    )
  );

  callback?.();
}

export const getInitialLobbyState: () => InitialGamePhaseData<GameState> = () => ({
  gameState: { state: "lobby" },
  lobbyData: {
    pickedSongs: [],
    songQueue: [],
    currentSongIndex: 0,
    songQueueGenerator: undefined,
  },
});

export const getInitialPickingGameState: () => InitialGamePhaseData<PickingGameState> = () => ({
  gameState: {
    state: "picking",
    playersWhoPickedIds: [],
    initialTimeRemainingInSec: SONG_PICKING_DURATION_IN_SEC,
  },
  lobbyData: { pickedSongs: [], songQueue: [] },
});

export const getInitialGuessingGameState: (
  songs: Song[]
) => InitialGamePhaseData<GuessingGameState> = (songs) => ({
  gameState: {
    state: "guessing",
    initialTimeRemaining: SONG_PICKING_DURATION_IN_SEC,
    currentInitialTimeRemaining: SONG_PICKING_DURATION_IN_SEC,
    startTime: 0,
    initialDelay: INITIAL_GUESSING_DELAY_IN_MS / 1000,
    playersWhoGuessed: [],
    isGuessingPaused: true,
  },
  lobbyData: {
    songQueue: shuffleArray(songs),
  },
});

export const getInitialLeaderboardsGameState: (
  songs: Song[]
) => InitialGamePhaseData<LeaderboardGameState> = (songs) => ({
  gameState: { state: "leaderboard", pickedSongs: songs },
  lobbyData: {},
});
