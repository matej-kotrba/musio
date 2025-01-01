export type Song = {
  fromPlayerById: string;
  name: string;
  artist: string;
  trackUrl: string;
};

export type GameStateType = "lobby" | "picking" | "guessing" | "leaderboard";

type LobbyGameState = {
  state: "lobby";
};

type PickingGameState = {
  state: "picking";
  playersWhoPickedIds: string[];
  initialTimeRemaining: number;
};

type GuessingGameState = {
  state: "guessing";
  songsToGuessQueue: Song[];
  currentSongIndex: number;
  initialTimeRemaining: number;
  currentInitialTimeRemaining: number;
};

type LeaderboardGameState = {
  state: "leaderboard";
};

export type GameState =
  | LobbyGameState
  | PickingGameState
  | GuessingGameState
  | LeaderboardGameState;
