export type Song = {
  fromPlayerById: string;
  name: string;
  artist: string;
  trackUrl: string;
};

export type LobbyGameState = {
  state: "lobby";
};

export type PickingGameState = {
  state: "picking";
  playersWhoPickedIds: string[];
  initialTimeRemainingInSec: number;
};

export type GuessingGameState = {
  state: "guessing";
  songsToGuessQueue: Song[];
  currentSongIndex: number;
  initialTimeRemaining: number;
  currentInitialTimeRemaining: number;
};

export type LeaderboardGameState = {
  state: "leaderboard";
};

export type GameState =
  | LobbyGameState
  | PickingGameState
  | GuessingGameState
  | LeaderboardGameState;

export type GameStateType = GameState["state"];
