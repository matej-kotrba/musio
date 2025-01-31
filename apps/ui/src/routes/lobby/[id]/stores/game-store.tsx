import type { ChatMessage, GameState, SongWithNameHidden } from "shared";
import type { PlayerToDisplay } from "~/components/game/Player";
import { createContext, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

export type GameStore = {
  players: PlayerToDisplay[];
  chatMessages: ChatMessage[];
  thisPlayerIds: { public: string; private: string };
  gameState: GameState;

  didPick: boolean;
  currentToGuess?: SongWithNameHidden;
  previousCorrectSongName?: string;
};

const getGameStoreActions = (store: GameStore, setStore: SetStoreFunction<GameStore>) => {
  return {
    setGameStore: setStore,
    resetPlayerChecks() {
      setStore("didPick", false);
    },
  } as const;
};

const getGameStoreQueries = (store: GameStore) => {
  return {
    getLobbyHost: () => store.players.find((player) => player.isHost),
    getThisPlayer: () =>
      store.players.find((player) => player.publicId === store.thisPlayerIds.public),
    getPlayerByPublicId: (publicId: string) =>
      store.players.find((player) => player.publicId === publicId),
  } as const;
};

type GetGameStoreActions = ReturnType<typeof getGameStoreActions>;
type GetGameStoreQueries = ReturnType<typeof getGameStoreQueries>;
type GetNewGameStoreReturnType = readonly [GameStore, GetGameStoreActions, GetGameStoreQueries];

export function getNewGameStore(): GetNewGameStoreReturnType {
  const [store, setStore] = createStore<GameStore>({
    players: [],
    chatMessages: [],
    thisPlayerIds: { public: "", private: "" },
    gameState: { state: "lobby" },

    didPick: false,
  });

  return [store, getGameStoreActions(store, setStore), getGameStoreQueries(store)] as const;
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

export const useGameStore = () => useContext(GameStoreContext);
