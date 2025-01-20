import { playerNameValidator } from "shared";
import { z } from "zod";
import { getAllIcons } from "~/components/lobby/Player";

const validIconNames = getAllIcons().map((icon) => icon.name);

export const playerProfileSchema = z.object({
  name: playerNameValidator,
  icon: z.string().refine((val) => validIconNames.includes(val), {
    message: "Invalid icon",
  }),
});
