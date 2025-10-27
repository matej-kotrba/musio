export const StatusCode = {
  LOBBY_FULL: "LOBBY_FULL",
} as const;

export type StatusCodes = (typeof StatusCode)[keyof typeof StatusCode];
