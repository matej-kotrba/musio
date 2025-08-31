import { z } from "zod";

export const DEFAULT_GAME_LIMIT_VALUE = 120;
export const MIN_GAME_LIMIT_VALUE = 50;
export const MAX_GAME_LIMIT_VALUE = 200;

export const gameLimitSchema = z.number().min(MIN_GAME_LIMIT_VALUE).max(MAX_GAME_LIMIT_VALUE);

export const DEFAULT_PLAYER_LIMIT = 9;
export const MIN_PLAYER_LIMIT = 2;
export const MAX_PLAYER_LIMIT = 12;

export const playerLimitSchema = z.number().min(MIN_PLAYER_LIMIT).max(MAX_PLAYER_LIMIT);
