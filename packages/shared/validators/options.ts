import { z } from "zod";

export const DEFAULT_GAME_LIMIT_VALUE = 120;
export const MIN_GAME_LIMIT_VALUE = 50;
export const MAX_GAME_LIMIT_VALUE = 200;

export const gameLimitSchema = z.number().min(MIN_GAME_LIMIT_VALUE).max(MAX_GAME_LIMIT_VALUE);
