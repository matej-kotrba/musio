const icons = import.meta.glob("/public/avatars/*", { query: "?url" });

export type Icon = {
  url: string;
  name: string;
};

export type Player = {
  id: string;
  name: string;
  icon: Icon;
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

export default function PlayerDisplay(props: Player) {
  return (
    <div class="flex gap-2">
      <img src={props.icon.url} alt="" class="rounded-lg w-24" />
      <div class="self-start">
        <div class="text-xl font-semibold">{props.name}</div>
        <div class="text-xl">25 points</div>
        <div class="w-fit text-white bg-blue-500 text-sm rounded-full px-2 py-1">
          Some badge
        </div>
      </div>
    </div>
  );
}
