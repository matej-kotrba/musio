import { z } from "zod";

export const songNameSchema = z.string().min(1).max(50);
