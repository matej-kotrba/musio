import { For, Show } from "solid-js";
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
  const emptyGameSlots = () => Array(gameStore.gameOptions.playerLimit).fill(null);
  const shouldDisplayPlaceholders = () =>
    gameStore.gameState?.state === "lobby" && gameStore.gameState?.type === "INITIAL";

  return (
    <>
      <aside
        class={`relative flex md:hidden flex-row gap-2 overflow-x-auto h-full overflow-y-clip pb-2`}
        style={{
          "scroll-snap-type": "x mandatory",
        }}
      >
        <For each={gameStore.players.toSorted((a, b) => b.points - a.points)}>
          {(player) => (
            <div class="player-sidebar duration-200 snap-start w-48">
              <PlayerDisplay
                maxPoints={gameStore.gameOptions.toPointsLimit}
                player={player}
                previousPoints={player.previousPoints}
                isMyself={queries.getThisPlayer()?.publicId === player.publicId}
              />
            </div>
          )}
        </For>
      </aside>
      <aside
        class={`${styles.aside__scrollbar} relative hidden md:flex flex-col gap-2 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
        style={{
          height: "var(--custom-height)",
          "scroll-snap-type": "y mandatory",
        }}
      >
        <TransitionGroup name="player-sidebar">
          <For each={props.players.toSorted((a, b) => b.points - a.points)}>
            {(player) => (
              <div class="player-sidebar duration-200 snap-start">
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
        <div class="flex flex-col gap-2 absolute w-80 pr-2 overflow-x-clip -z-10">
          <Show when={shouldDisplayPlaceholders}>
            <For each={emptyGameSlots()}>{() => <EmptyGameSlot />}</For>
          </Show>
        </div>
      </aside>
    </>
  );
}

function EmptyGameSlot() {
  return (
    <div class="flex h-24 items-center gap-3 p-3 rounded-lg bg-background-accent border-2 border-dashed border-background-highlight snap-start">
      <div class="w-16 aspect-square rounded-lg bg-background-highlight grid content-center">
        <Icon icon="tabler:users" class="text-xl text-gray-400" />
      </div>
      <span class="text-gray-500 text-sm font-semibold">Waiting for player...</span>
    </div>
  );
}
