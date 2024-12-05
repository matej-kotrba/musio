import { z } from "zod";
import { getAllIcons } from "~/components/lobby/Player";

const validIconNames = getAllIcons().map((icon) => icon.name);

export const playerProfileSchema = z.object({
  name: z.string().min(1),
  icon: z.string().refine((val) => validIconNames.includes(val), {
    message: "Invalid icon name",
  }),
});
