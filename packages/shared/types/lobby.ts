export type Song = {
  fromPlayerById: string;
  name: string;
  artist: string;
  trackUrl: string;
  imageUrl100x100: string;
};

export type SongWithNameHidden = Omit<Song, "name"> & { name: (string | null)[][] };

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
  initialDelay: number;
  initialTimeRemaining: number;
  currentInitialTimeRemaining: number;
  startTime: number;
  playersWhoGuessed: { id: string; points: number }[];
  // Detects whether guessing is paused, for example during delay, in between songs...
  isGuessingPaused?: boolean;
};

export type LeaderboardGameState = {
  state: "leaderboard";
  pickedSongs: Song[];
};

export type GameState =
  | LobbyGameState
  | PickingGameState
  | GuessingGameState
  | LeaderboardGameState;

export type GameStateType = GameState["state"];
