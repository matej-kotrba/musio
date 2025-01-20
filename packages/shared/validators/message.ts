import { z } from "zod";

export const messageLengthSchema = z.string().min(1).max(256);
