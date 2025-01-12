import {
  createNewMessageToClient,
  messageToClientGameState,
  toPayloadToClient,
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
import { abortLobbyTimeoutSignalAndRemove, shuffleArray, waitFor } from "./utils.js";
import type { PlayerServer } from "./player.js";
import { setTimeout } from "timers/promises";

export type LobbiesMap = LobbyMap<string, Lobby>;

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
  };
};

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
  lobbyData: { pickedSongs: [], songQueue: [] },
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
    playersWhoGuessed: [],
  },
  lobbyData: {
    songQueue: shuffleArray(songs),
  },
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

  const INITIAL_GUESSING_DELAY_IN_MS = 5000;
  startGuessingSongQueue(lobbies, lobby.id, {
    initialDelay: INITIAL_GUESSING_DELAY_IN_MS,
  });
}

export async function startGuessingSongQueue(
  lobbies: LobbiesMap,
  lobbyId: string,
  { initialDelay = 5000 }: { initialDelay?: number }
) {
  const lobby = lobbies.get(lobbyId);
  if (!lobby || lobby.stateProperties.state !== "guessing") return;

  const DELAY_BETWEEN_SONGS_IN_MS = 3000;

  await waitFor(initialDelay);

  lobby.data.songQueueGenerator = handleSongInQueue(lobbies, lobby, { delay: 3000 });

  abortLobbyTimeoutSignalAndRemove(lobby);
  resetGuessingState(lobby.stateProperties as GuessingGameState);
  lobby.data.currentTimeoutAbortController = new AbortController();

  const { value: currentIndex } = lobby.data.songQueueGenerator.next();

  setTimeout(SONG_PICKING_DURATION * 1000, null, {
    signal: lobby.data.currentTimeoutAbortController.signal,
  }).then(() => {
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
  });
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
            name: song.name,
            artist: song.artist,
            trackUrl: song.trackUrl,
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
