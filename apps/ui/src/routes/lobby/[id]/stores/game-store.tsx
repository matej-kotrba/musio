import type { ChatMessage, GameState, SongWithNameHidden } from "shared";
import type { PlayerToDisplay } from "~/components/game/Player";
import { createContext, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export type GameStore = {
  lobbyId: string;
  players: PlayerToDisplay[];
  chatMessages: ChatMessage[];
  thisPlayerIds?: { public: string; private: string };
  gameState: GameState;

  didPick: boolean;
  currentSongToGuess?: SongWithNameHidden;
  previousSongData?: {
    correctSongName: string;
    pointsPerPlayers: { publicId: string; points: number }[];
  };
  delaySongProgress?: { currentIndex: number; songsLength: number };
};

const getGameStoreActions = (store: GameStore, setStore: SetStoreFunction<GameStore>) => {
  return {
    setGameStore: setStore,
    resetPlayerChecks() {
      setStore("players", () => true, "isChecked", false);
      setStore("didPick", false);
    },
  } as const;
};

const getGameStoreQueries = (store: GameStore) => {
  return {
    getLobbyHost: () => store.players.find((player) => player.isHost),
    getThisPlayer: () =>
      store.players.find((player) => player.publicId === store.thisPlayerIds?.public),
    getPlayerByPublicId: (publicId: string) =>
      store.players.find((player) => player.publicId === publicId),
  } as const;
};

type GetGameStoreActions = ReturnType<typeof getGameStoreActions>;
type GetGameStoreQueries = ReturnType<typeof getGameStoreQueries>;
type GetNewGameStoreReturnType = readonly [
  GameStore,
  { actions: GetGameStoreActions; queries: GetGameStoreQueries }
];

export function getNewGameStore(): GetNewGameStoreReturnType {
  const [store, setStore] = createStore<GameStore>({
    lobbyId: "",
    players: [],
    chatMessages: [],
    gameState: {
      state: "guessing",
      isGuessingPaused: true,
      initialDelay: 50000,
      playersWhoGuessed: [],
      startTime: 10000000,
      initialTimeRemaining: 50000,
      currentInitialTimeRemaining: 500000,
    },
    previousSongData: {
      correctSongName: "Monody",
      pointsPerPlayers: [],
    },

    didPick: false,
  });

  return [
    store,
    { actions: getGameStoreActions(store, setStore), queries: getGameStoreQueries(store) },
  ] as const;
}

const GameStoreContext = createContext<GetNewGameStoreReturnType>(getNewGameStore());

type GameStoreProviderProps = {
  gameStore: GetNewGameStoreReturnType;
  children: JSX.Element;
};

export function GameStoreProvider(props: GameStoreProviderProps) {
  return (
    <GameStoreContext.Provider value={props.gameStore}>{props.children}</GameStoreContext.Provider>
  );
}

export const useGameStore = () => {
  const context = useContext(GameStoreContext);
  if (!context) {
    throw new Error("useGameStore must be used within a GameStoreProvider");
  }
  return context;
};
