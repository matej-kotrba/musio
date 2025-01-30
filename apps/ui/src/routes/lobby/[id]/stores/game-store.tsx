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
    resetPlayerChecks() {
      setStore("didPick", false);
    },
  } as const;
};

type GetGameStoreActions = ReturnType<typeof getGameStoreActions>;
type GetNewGameStoreReturnType = readonly [GameStore, GetGameStoreActions];

export function getNewGameStore(): GetNewGameStoreReturnType {
  const [store, setStore] = createStore<GameStore>({
    players: [],
    chatMessages: [],
    thisPlayerIds: { public: "", private: "" },
    gameState: { state: "lobby" },

    didPick: false,
  });

  return [store, getGameStoreActions(store, setStore)] as const;
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

export const getGameStore = () => useContext(GameStoreContext);
