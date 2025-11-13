export const StatusCode = {
  LOBBY_FULL: "LOBBY_FULL",
  INVALID_USER_PROFILE: "INVALID_USER_PROFILE",
} as const;

export type StatusCodes = (typeof StatusCode)[keyof typeof StatusCode];
