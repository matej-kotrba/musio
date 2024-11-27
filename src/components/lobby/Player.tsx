const icons = import.meta.glob("/public/avatars/*", { query: "?url" });

export type Icon = {
  url: string;
  name: string;
};

export type Player = {
  id: string;
  name: string;
  icon: Icon;
  points: number;
};

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
  const maxPointsBarWidth = 150;

  function displayPointsInPercentage() {
    return (props.player.points / props.maxPoints) * 100;
  }

  return (
    <div class="flex gap-2">
      <img src={props.player.icon.url} alt="" class="rounded-lg w-24" />
      <div class="min-w-0 self-start">
        <div class="text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
          {props.player.name}
        </div>
        <div class="flex">
          <div class="p-2 rounded-full w-8 aspect-square">
            {props.player.points}
          </div>
          <div
            class="text-sm text-foreground-dark px-1 my-2 bg-primary rounded-full w-full"
            // style={{
            //   width: `${
            //     (maxPointsBarWidth / 100) * displayPointsInPercentage()
            //   }px`,
            // }}
          ></div>
        </div>
        <div class="w-fit text-white bg-blue-500 text-sm rounded-full px-2 py-1">
          Some badge
        </div>
      </div>
    </div>
  );
}
