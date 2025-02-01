import { For, Show } from "solid-js";
import styles from "./index.module.css";
import PlayerDisplay from "~/components/game/Player";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";

type Props = {
  shouldShow: boolean;
};

export default function PlayerList(props: Props) {
  const [gameStore] = useGameStore();

  return (
    <aside
      class={`${styles.aside__scrollbar} relative flex flex-col gap-4 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
      style={{
        height: "var(--custom-height)",
        "scroll-snap-type": "y mandatory",
      }}
    >
      <Show when={props.shouldShow} fallback={<p>Selecting...</p>}>
        <For each={gameStore.players.toSorted((a, b) => b.points - a.points)}>
          {(player, index) => (
            <PlayerDisplay
              maxPoints={100}
              player={player}
              isLeading={!index()}
              previousPoints={player.previousPoints}
            />
          )}
        </For>
      </Show>
    </aside>
  );
}
