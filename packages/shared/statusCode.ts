export const StatusCode = {
  LOBBY_FULL: "LOBBY_FULL",
  INVALID_USER_PROFILE: "INVALID_USER_PROFILE",
  RECONNECTED_PLAYER_NO_LONGER_IN_LOBBY: "RECONNECTED_PLAYER_NO_LONGER_IN_LOBBY",
} as const;

export type StatusCodes = (typeof StatusCode)[keyof typeof StatusCode];
