import { z } from "zod";

export const playerNameValidator = z.string().min(3).max(20);
export const playerIconNameValidator = z.string();
