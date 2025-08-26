import { Icon } from "@iconify-icon/solid";
import { JSX } from "solid-js";
import { useGameStore } from "~/routes/lobby/stores/game-store";

type BadgeProps = {
  children: JSX.Element;
};

function Badge(props: BadgeProps) {
  return (
    <div class="text-sm flex items-center gap-1 border-2 rounded-lg px-1">{props.children}</div>
  );
}

export default function Stats() {
  const [gameStore] = useGameStore();

  return (
    <div class="flex justify-end items-center gap-1">
      <Badge>
        <div>
          <span>{gameStore.players.length}</span>
          <span class="text-foreground/75">/</span>
          <span>{gameStore.gameOptions.playerLimit}</span>
        </div>
        <Icon
          icon="lucide:users-round"
          class="text-md text-foreground align-middles duration-100"
        />
      </Badge>
      <Badge>
        <span>{gameStore.gameOptions.toPointsLimit}</span>
        <Icon icon="lucide:target" class="text-md text-foreground align-middles duration-100" />
      </Badge>
    </div>
  );
}
