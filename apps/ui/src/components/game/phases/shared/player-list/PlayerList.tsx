import { For, Show } from "solid-js";
import styles from "./index.module.css";
import PlayerDisplay from "~/components/game/Player";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";
import { TransitionGroup } from "solid-transition-group";

export default function PlayerList() {
  const [gameStore] = useGameStore();

  return (
    <aside
      class={`${styles.aside__scrollbar} relative flex flex-col gap-4 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
      style={{
        height: "var(--custom-height)",
        "scroll-snap-type": "y mandatory",
      }}
    >
      <TransitionGroup name="player-sidebar">
        <For each={gameStore.players.toSorted((a, b) => b.points - a.points)}>
          {(player, index) => (
            <div class="player-sidebar duration-200">
              <PlayerDisplay
                maxPoints={100}
                player={player}
                isLeading={!index()}
                previousPoints={player.previousPoints}
              />
            </div>
          )}
        </For>
      </TransitionGroup>
    </aside>
  );
}
