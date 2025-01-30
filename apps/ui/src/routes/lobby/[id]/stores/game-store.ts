import type { ChatMessage, GameState, Player, SongWithNameHidden } from "shared";
import { createStore } from "solid-js/store";

type GameStore = {
  players: Player[];
  chatMessages: ChatMessage[];
  thisPlayerIds: { public: string; private: string };
  gameState: GameState;

  didPick: boolean;
  currentToGuess?: SongWithNameHidden;
  previousCorrectSongName?: string;
};

export function createNewGameStore() {
  const [get, set] = createStore<GameStore>({
    players: [],
    chatMessages: [],
    thisPlayerIds: { public: "", private: "" },
    gameState: { state: "lobby" },

    didPick: false,
  });

  const actions = {};

  return [get, actions];
}
