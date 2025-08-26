import { z } from "zod";

const MIN = 1;
const MAX = 256;

export const messageLengthSchema = z
  .string()
  .min(MIN, `Message has to have at least ${MIN} character`)
  .max(MAX, `Message has to be at max ${MAX} characters long`);
