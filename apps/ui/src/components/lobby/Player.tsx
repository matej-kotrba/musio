import { Icon } from "@iconify-icon/solid";
import { Icon as IconType, Player } from "shared/index.types";
import { Show } from "solid-js";

const icons = import.meta.glob("/public/avatars/*", { query: "?url" });

export function getAllIcons(): IconType[] {
  return Object.keys(icons).map((iconPath) => {
    const name = iconPath.split("/").at(-1)!.split(".")[0];
    name[0].toUpperCase();

    return {
      url: "/" + iconPath.split("/").slice(2).join("/"),
      name: name,
    } as IconType;
  });
}

type Props = {
  player: Player;
  maxPoints: number;
  isLeading?: boolean;
};

export default function PlayerDisplay(props: Props) {
  function displayPointsInPercentage() {
    return (props.player.points / props.maxPoints) * 100;
  }

  return (
    <div class="relative flex gap-2">
      <div class="relative w-28">
        <img src={props.player.icon.url} alt="" class="rounded-lg" />
        <Show when={props.isLeading}>
          <div class="absolute right-1 top-1 rotate-45">
            <Icon
              icon={"solar:crown-bold"}
              class="text-xl text-yellow-400"
              style={{ filter: "drop-shadow(0 0 2px black)" }}
            />
          </div>
        </Show>
      </div>
      <div class="min-w-0 self-start w-full">
        <div
          class="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis"
          title={props.player.name}
        >
          {props.player.name}
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center">
          <div class="px-1 rounded-full bg-background-DEAFULT border-2 border-primary">
            {props.player.points}
          </div>
          <div class="relative h-2 text-sm text-foreground-dark my-2 -translate-x-[1px]">
            <div class="w-full h-full bg-secondary absolute left-0 top-0 -z-10 rounded-r-full"></div>
            <div
              style={{
                width: `${displayPointsInPercentage()}%`,
              }}
              class="w-full h-full bg-primary rounded-r-full"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
