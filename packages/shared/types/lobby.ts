export type Song = {
  fromPlayerByPublicId: string;
  name: string;
  artist: string;
  trackUrl: string;
  imageUrl100x100: string;
};

export type SongWithNameHidden = Omit<Song, "name"> & { name: (string | null)[][] };

export type LobbyGameState = {
  state: "lobby";
  type: "INITIAL" | "IN_BETWEEN_ROUNDS";
};

export type PickingGameState = {
  state: "picking";
  playersWhoPickedIds: string[];
  initialTimeRemainingInSec: number;
};

type SongPointGainForPrivateId = {
  privateId: string;
  points: number;
};

export type GuessingGameState = {
  state: "guessing";
  initialDelay: number;
  initialTimeRemaining: number;
  currentInitialTimeRemaining: number;
  startTime: number;
  playersWhoGuessed: SongPointGainForPrivateId[];
  playerWhoPickedTheSong?: SongPointGainForPrivateId;
  // Detects whether guessing is paused, for example during delay, in between songs...
  isGuessingPaused?: boolean;
};

export type LeaderboardGameState = {
  state: "leaderboard";
  pickedSongs: Song[];
};

export type GameStateMap = {
  lobby: LobbyGameState;
  picking: PickingGameState;
  guessing: GuessingGameState;
  leaderboard: LeaderboardGameState;
};

export type GameState = GameStateMap[keyof GameStateMap];

export type GameStateType = GameState["state"];
