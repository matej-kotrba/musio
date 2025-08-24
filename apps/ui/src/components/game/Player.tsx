import { Icon } from "@iconify-icon/solid";
import { Icon as IconType, Player } from "shared/index.types";
import { Show } from "solid-js";
import { Motion } from "solid-motionone";

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

export type PlayerToDisplay = Player & { previousPoints?: number };

type Props = {
  player: Player;
  maxPoints: number;
  previousPoints?: number;
};

export default function PlayerDisplay(props: Props) {
  function displayPointsInPercentage() {
    return (props.player.points / props.maxPoints) * 100;
  }

  return (
    <>
      <div
        classList={{
          "relative flex gap-2 snap-start bg-background-highlight/40 p- border border-background-highlight rounded-md":
            true,
          "opacity-50": props.player.status === "disconnected",
        }}
      >
        <div class="relative w-20">
          <img src={props.player.icon.url} alt="" class="rounded-lg border-2 border-primary/50" />
          <Show when={props.player.status === "disconnected"}>
            <div class="absolute left-1 top-1">
              <Icon
                icon={"lucide:unplug"}
                class="text-lg text-foreground"
                style={{ filter: "drop-shadow(0 0 2px black)" }}
              />
            </div>
          </Show>
          <Show when={props.player.isHost}>
            <div class="absolute right-1 top-1 rotate-45">
              <Icon
                icon={"solar:crown-bold"}
                class="text-lg text-yellow-400"
                style={{ filter: "drop-shadow(0 0 2px black)" }}
              />
            </div>
          </Show>
          <Show when={props.player.isChecked}>
            <Motion
              transition={{ duration: 0.4 }}
              initial={{ rotateZ: -270, opacity: 0, scale: 0 }}
              animate={{ rotateZ: 0, opacity: 1, scale: 1 }}
              exit={{ rotateZ: -270, opacity: 0, scale: 0 }}
              class="absolute grid place-content-center bottom-1 right-1 bg-primary-darker rounded-full p-1 shadow-md border border-primary-accent"
            >
              <Icon icon={"charm:tick"} class="text-lg text-white duration-100" />
            </Motion>
          </Show>
        </div>
        <div class="min-w-0 self-start w-full">
          <div
            class="text-lg font-medium overflow-hidden whitespace-nowrap text-ellipsis"
            title={props.player.name}
          >
            {props.player.name}
          </div>
          <div class="grid grid-cols-[auto,1fr] items-center">
            <div class="px-1 box-border rounded-full bg-background-DEAFULT border-2 border-primary z-[2] min-w-[calc(4ch+2*0.25rem)] font-mono text-center text-sm">
              {props.player.points}
            </div>
            <div class="relative h-2 text-sm text-foreground-dark my-2 -translate-x-[1px]">
              <div class="w-full h-full bg-secondary absolute left-0 top-0 -z-10 rounded-r-full"></div>
              <div
                style={{
                  width: `${displayPointsInPercentage()}%`,
                }}
                class="max-w-full h-full bg-primary/80 rounded-r-full duration-1000"
              ></div>
            </div>
          </div>
          <Show when={props.previousPoints !== undefined}>
            {/* +1 is needed because zero is interpreted as false so it wont display */}
            <Show when={props.previousPoints! + 1} keyed>
              <Motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, x: 50 }}
                transition={{ duration: 3 }}
                class="absolute bottom-0 left-1/2 -translate-x-1/2"
              >
                <span class="text-green-600">+{props.player.points - props.previousPoints!}</span>
              </Motion.div>
            </Show>
          </Show>
        </div>
      </div>
    </>
  );
}
