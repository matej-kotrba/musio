import type { messageConfig } from "../messages";
import type { GameOptions, GameState, SongWithNameHidden } from "./lobby";
import type { PlayerFromServer, PlayerStatus } from "./player";

// Player ids are never specified as they are passed with the ws messageToClient already
export type WS_MessageMapServer = {
  PLAYER_INIT: {
    allPlayers: PlayerFromServer[];
    thisPlayerPublicId: string;
    thisPlayerPrivateId: string;
    gameOptions: GameOptions;
    gameStateData?: GameState;
  };
  PLAYER_JOIN: PlayerFromServer;
  CHANGE_GAME_STATE: {
    properties: GameState;
  };
  CHANGE_GAME_OPTIONS: {
    gameLimit?: number;
    playerLimit?: number;
  };
  PLAYER_PICKED_SONG: {};
  PLAYER_REMOVED_FROM_LOBBY: {
    publicId: string;
  };
  PLAYER_STATUS_CHANGE: {
    newStatus: PlayerStatus;
  };
  NEW_SONG_TO_GUESS: {
    song: SongWithNameHidden;
    initialTimeRemaining: number;
  };
  IN_BETWEEN_SONGS_DELAY: {
    delay: number;
    correctSongName: string;
    pointsPerPlayer: { publicId: string; points: number }[];
    songsInQueue: { currentIndex: number; songsInQueueByPlayerPublicIds: string[] };
  };
  CHAT_MESSAGE_CONFIRM: {
    isOk: boolean;
    type: GuessChatMessageType;
    messageId: string;
  };
  CHAT_MESSAGE: {
    content: string;
  };
  CHANGE_POINTS: {
    publicId: string;
    newPoints: number;
  }[];
};

export type GuessChatMessageType = "near" | "guessed" | false;

type MessageConfig = typeof messageConfig;

type EventToState = {
  [Key in keyof MessageConfig as keyof MessageConfig[Key]]: Key;
};

export type WS_MessageMapClient = {
  [State in keyof EventToState]: State extends keyof MessageConfig[EventToState[State]]
    ? MessageConfig[EventToState[State]][State]
    : never;
};

export type WS_MESSAGE = WS_MessageMapServer | WS_MessageMapClient;

export type WS_MESSAGE_TO_SERVER_TYPE = keyof WS_MessageMapServer;
export type WS_MESSAGE_TO_CLIENT_TYPE = keyof WS_MessageMapClient;

export type WS_MessageInterface<T extends WS_MESSAGE> = {
  [Key in keyof T]: {
    type: Key;
    payload: T[Key];
    lobbyId: string;
  };
};

export type ChatMessage = {
  id?: string;
  senderName: string;
  content: string;
  guessRelation: GuessChatMessageType;
  isOptimistic?: boolean;
};
