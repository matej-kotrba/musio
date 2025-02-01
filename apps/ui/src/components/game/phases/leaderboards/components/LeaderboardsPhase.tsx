import { Icon } from "@iconify-icon/solid";
import { Show } from "solid-js";
import { LeaderboardsEmphasized } from "./leaderboards";
import { Button } from "~/components/ui/button";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";

export default function LeaderboardsGamePhase() {
  const [gameStore, { queries }] = useGameStore();
  const { getThisPlayer } = queries;

  return (
    <>
      <div class="px-2 mt-8">
        <Show when={getThisPlayer()?.isHost}>
          <Button class="ml-auto flex items-center gap-1">
            <span class="font-bold">Next round</span>{" "}
            <Icon icon="mingcute:repeat-fill" class="text-xl" />
          </Button>
        </Show>
        <LeaderboardsEmphasized players={gameStore.players} />
      </div>
    </>
  );
}
