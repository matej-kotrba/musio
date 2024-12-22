import { Icon, Player } from "shared/index.types";

const icons = import.meta.glob("/public/avatars/*", { query: "?url" });

export function getAllIcons(): Icon[] {
  return Object.keys(icons).map((iconPath) => {
    const name = iconPath.split("/").at(-1)!.split(".")[0];
    name[0].toUpperCase();

    return {
      url: "/" + iconPath.split("/").slice(2).join("/"),
      name: name,
    } as Icon;
  });
}

type Props = {
  player: Player;
  maxPoints: number;
};

export default function PlayerDisplay(props: Props) {
  function displayPointsInPercentage() {
    return (props.player.points / props.maxPoints) * 100;
  }

  return (
    <div class="flex gap-2">
      <img src={props.player.icon.url} alt="" class="rounded-lg w-24" />
      <div class="min-w-0 self-start w-full">
        <div class="text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
          {props.player.name}
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center">
          <div class="px-1 rounded-full bg-background-DEAFULT border-2 border-primary">
            {props.player.points}
          </div>
          <div
            class="h-2 text-sm text-foreground-dark px-1 my-2 bg-primary rounded-r-full -translate-x-[1px]"
            style={{
              width: `${displayPointsInPercentage()}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
