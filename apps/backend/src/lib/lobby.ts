import {
  createNewMessageToClient,
  messageToClientGameState,
  toPayloadToClient,
  type GameState,
  type GameStateType,
  type GuessingGameState,
  type LeaderboardGameState,
  type PickingGameState,
  type Song,
  type WS_MessageInterface,
  type WS_MessageMapClient,
} from "shared";
import {
  DELAY_BETWEEN_SONGS_IN_MS,
  INITIAL_GUESSING_DELAY_IN_MS,
  SONG_PICKING_DURATION,
} from "./constants.js";
import { abortLobbyTimeoutSignalAndRemove, shuffleArray, waitFor } from "./utils.js";
import { type PlayerServer } from "./player.js";
import { setTimeout } from "timers/promises";
import type { LobbiesMap } from "./create.js";

export type Lobby = {
  id: string;
  stateProperties: GameState;
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

export function changeLobbyState(lobby: Lobby, state: InitialGamePhaseData<GameState>) {
  lobby.stateProperties = state.gameState;
  lobby.data = { ...lobby.data, ...state.lobbyData };
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

export function changeToGuessingGameLobbyState(lobbies: LobbiesMap, lobby: Lobby) {
  abortLobbyTimeoutSignalAndRemove(lobby);
  changeLobbyState(lobby, getInitialGuessingGameState(lobby.data.pickedSongs));

  lobbies.broadcast(
    lobby.id,
    toPayloadToClient(
      "server",
      createNewMessageToClient(lobby.id, "CHANGE_GAME_STATE", {
        properties: lobby.stateProperties,
      })
    )
  );

  runGuessingSongQueue(lobbies, lobby.id, {
    initialDelay: INITIAL_GUESSING_DELAY_IN_MS,
  });
}

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

export function isLobbyState<T extends GameStateType>(
  props: GameState,
  condition: T
): props is Extract<typeof props, { state: T }> {
  return props.state === condition;
}

export async function runGuessingSongQueue(
  lobbies: LobbiesMap,
  lobbyId: string,
  { initialDelay = 5000 }: { initialDelay?: number }
) {
  const lobby = lobbies.get(lobbyId);
  if (!lobby || lobby.stateProperties.state !== "guessing") return;

  lobby.stateProperties.isGuessingPaused = true;
  await waitFor(initialDelay);
  lobby.stateProperties.isGuessingPaused = false;

  lobby.data.songQueueGenerator = handleSongInQueue(lobbies, lobby, { delay: 3000 });

  while (true) {
    const { value: currentIndex } = lobby.data.songQueueGenerator.next();
    if (currentIndex === undefined) break;
    lobby.data.currentSongIndex = currentIndex;
    lobby.stateProperties.startTime = Date.now();

    abortLobbyTimeoutSignalAndRemove(lobby);
    resetGuessingState(lobby.stateProperties as GuessingGameState);
    lobby.data.currentTimeoutAbortController = new AbortController();

    await new Promise((res, rej) => {
      setTimeout(SONG_PICKING_DURATION * 1000, null, {
        signal: lobby.data.currentTimeoutAbortController!.signal,
      })
        .catch((e) => {})
        .finally(async () => {
          lobbies.broadcast(
            lobby.id,
            toPayloadToClient(
              "server",
              createNewMessageToClient(lobby.id, "IN_BETWEEN_SONGS_DELAY", {
                delay: DELAY_BETWEEN_SONGS_IN_MS,
                correctSongName: lobby.data.songQueue[currentIndex].name,
              })
            )
          );

          if (isLobbyState(lobby.stateProperties, "guessing")) {
            lobby.stateProperties.isGuessingPaused = true;
            await waitFor(DELAY_BETWEEN_SONGS_IN_MS);
            lobby.stateProperties.isGuessingPaused = false;
          }

          res("Done");
        });
    });
  }

  changeLobbyState(lobby, getInitialLeaderboardsGameState(lobby.data.pickedSongs));
  lobbies.broadcast(
    lobby.id,
    toPayloadToClient(
      "server",
      createNewMessageToClient(lobby.id, "CHANGE_GAME_STATE", {
        properties: lobby.stateProperties,
      })
    )
  );
}

function* handleSongInQueue(lobbies: LobbiesMap, lobby: Lobby, { delay }: { delay: number }) {
  let currentSongIndex = 0;

  while (currentSongIndex < lobby.data.songQueue.length) {
    const song = lobby.data.songQueue[currentSongIndex];
    if (!song) return;

    lobbies.broadcast(
      lobby.id,
      toPayloadToClient(
        "server",
        createNewMessageToClient(lobby.id, "NEW_SONG_TO_GUESS", {
          song: {
            ...song,
            name: song.name
              .split(" ")
              .map((word) => Array.from({ length: word.length }, () => null)),
          },
          initialTimeRemaining: SONG_PICKING_DURATION,
        })
      )
    );

    yield currentSongIndex++;
  }
}

function resetGuessingState(stateProperties: GuessingGameState) {
  stateProperties.playersWhoGuessed = [];
}
