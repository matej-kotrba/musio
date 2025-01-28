import {
  createNewMessageToClient,
  messageToClientGameState,
  toPayloadToClient,
  type GameState,
  type GameStateMap,
  type GameStateType,
  type GuessingGameState,
  type LeaderboardGameState,
  type PickingGameState,
  type Song,
  type WS_MessageInterface,
  type WS_MessageMapClient,
} from "shared";
import { INITIAL_GUESSING_DELAY_IN_MS, SONG_PICKING_DURATION } from "./constants.js";
import { abortLobbyTimeoutSignalAndRemoveIt, shuffleArray } from "./utils.js";
import { type PlayerServer } from "./player.js";
import type { LobbiesMap } from "./create.js";

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

// export function getBasicEventData(
//   lobbies: LobbiesMap,
//   parsed: ReturnType<typeof fromMessage<WS_MessageMapClient>>
// ): { success: false } | { success: true; lobby: Lobby; player: PlayerServer } {
//   const lobby = lobbies.get(parsed.message.lobbyId);
//   if (!lobby) return { success: false };
//   const player = getPlayerByPrivateId(lobby, parsed.privateId);
//   if (!player) return { success: false };
//   return {
//     success: true,
//     lobby,
//     player,
//   };
// }

type InitialGamePhaseData<T extends GameState> = {
  gameState: T;
  lobbyData: { [Key in keyof Lobby["data"]]?: Lobby["data"][Key] };
};

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
  lobbyData: { pickedSongs: [], songQueue: [], currentSongIndex: 0 },
});

export const getInitialPickingGameState: () => InitialGamePhaseData<PickingGameState> = () => ({
  gameState: {
    state: "picking",
    playersWhoPickedIds: [],
    initialTimeRemainingInSec: SONG_PICKING_DURATION,
  },
  lobbyData: { pickedSongs: [], songQueue: [] },
});

export const getInitialGuessingGameState: (
  songs: Song[]
) => InitialGamePhaseData<GuessingGameState> = (songs) => ({
  gameState: {
    state: "guessing",
    initialTimeRemaining: SONG_PICKING_DURATION,
    currentInitialTimeRemaining: SONG_PICKING_DURATION,
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

type MessageToClientGameState = typeof messageToClientGameState;
type Messages = WS_MessageInterface<WS_MessageMapClient>[keyof WS_MessageMapClient];

export function isLobbyState<T extends GameStateType>(
  lobby: Lobby,
  condition: T
): lobby is Extract<Lobby, { stateProperties: { state: T } }> {
  return lobby.stateProperties.state === condition;
}
