import { Icon } from "@iconify-icon/solid";
import { Player } from "shared";
import { Show } from "solid-js";
import { LeaderboardsEmphasized } from "./leaderboards";
import { Button } from "~/components/ui/button";

type LeaderboardsGamePhaseProps = {
  players: Player[];
  isThisPlayerHost?: boolean;
};

export default function LeaderboardsGamePhase(props: LeaderboardsGamePhaseProps) {
  return (
    <>
      <div class="px-2 mt-8">
        <Show when={props.isThisPlayerHost || true}>
          <Button class="ml-auto flex items-center gap-1">
            <span class="font-bold">Next round</span>{" "}
            <Icon icon="mingcute:repeat-fill" class="text-xl" />
          </Button>
        </Show>
        <LeaderboardsEmphasized players={props.players} />
      </div>
    </>
  );
}
