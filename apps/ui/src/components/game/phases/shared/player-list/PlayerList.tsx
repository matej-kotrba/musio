import { createEffect, For, Show } from "solid-js";
import styles from "./index.module.css";
import PlayerDisplay, { PlayerToDisplay } from "~/components/game/Player";
import { useGameStore } from "~/routes/lobby/stores/game-store";
import { TransitionGroup } from "solid-transition-group";
import { Icon } from "@iconify-icon/solid";

type Props = {
  players: PlayerToDisplay[];
};

export default function PlayerList(props: Props) {
  const [gameStore, { queries }] = useGameStore();
  const emptyGameSlots = () =>
    Array(Math.max(gameStore.gameOptions.playerLimit - props.players.length, 0)).fill(null);
  const shouldDisplayPlaceholders =
    gameStore.gameState?.state === "lobby" && gameStore.gameState?.type === "INITIAL";

  return (
    <aside
      class={`${styles.aside__scrollbar} relative flex flex-col gap-2 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
      style={{
        height: "var(--custom-height)",
        "scroll-snap-type": "y mandatory",
      }}
    >
      <TransitionGroup name="player-sidebar">
        <For each={props.players.toSorted((a, b) => b.points - a.points)}>
          {(player, index) => (
            <div class="player-sidebar duration-200">
              <PlayerDisplay
                maxPoints={gameStore.gameOptions.toPointsLimit}
                player={player}
                previousPoints={player.previousPoints}
                isMyself={queries.getThisPlayer()?.publicId === player.publicId}
              />
            </div>
          )}
        </For>
      </TransitionGroup>
      <Show when={shouldDisplayPlaceholders}>
        <For each={emptyGameSlots()}>{() => <EmptyGameSlot />}</For>
      </Show>
    </aside>
  );
}

function EmptyGameSlot() {
  return (
    <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-700/20 border-2 border-dashed border-gray-600">
      <div class="w-16 aspect-square rounded-lg bg-gray-600/50 grid content-center">
        <Icon icon="tabler:users" class="text-xl text-gray-500" />
      </div>
      <span class="text-gray-500 text-sm font-semibold">Waiting for player...</span>
    </div>
  );
}
