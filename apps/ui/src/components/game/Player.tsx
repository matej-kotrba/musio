import { Icon } from "@iconify-icon/solid";
import { Icon as IconType, ClientPlayer } from "shared/index.types";
import { Match, Show, Switch } from "solid-js";
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

export type PlayerToDisplay = ClientPlayer & { previousPoints?: number };

type Props = {
  player: ClientPlayer;
  maxPoints: number;
  previousPoints?: number;
  isMyself?: boolean;
};

export default function PlayerDisplay(props: Props) {
  function getPlayerPointsAsPercentage() {
    return Math.min((props.player.points / props.maxPoints) * 100, 100);
  }

  function getIconBasedOnPlayerStatus(icon: Props["player"]["playerStatus"]) {
    if (icon === "ignored") {
      return "material-symbols-light:do-not-disturb-on-total-silence-rounded";
    } else if (icon === "checked") {
      return "charm:tick";
    }
  }

  return (
    <div
      classList={{
        "group h-24 relative snap-start bg-background-accent p-3 pb-5 border border-background-highlight rounded-md overflow-hidden":
          true,
        "opacity-50": props.player.connectionStatus === "disconnected",
      }}
    >
      <div class="flex gap-2">
        {/* SVGs on player img */}
        <div class="relative w-20">
          <img
            src={props.player.icon.url}
            alt=""
            class="w-16 aspect-square rounded-lg border-2 border-primary/50 box-content"
          />
          <Show when={props.player.connectionStatus === "disconnected"}>
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
          <Show when={props.player.playerStatus}>
            <Motion
              transition={{ duration: 0.4 }}
              initial={{ rotateZ: -270, opacity: 0, scale: 0 }}
              animate={{ rotateZ: 0, opacity: 1, scale: 1 }}
              exit={{ rotateZ: -270, opacity: 0, scale: 0 }}
              class="absolute grid place-content-center bottom-1 right-1 bg-primary-darker rounded-full p-1 shadow-md border border-primary-accent"
            >
              <Icon
                icon={getIconBasedOnPlayerStatus(props.player.playerStatus)!}
                class="text-lg text-white duration-100"
              />
            </Motion>
          </Show>
        </div>
        {/* Main content */}
        <div class="min-w-0 self-start w-full">
          <div
            class="flex gap-2 items-center text-lg font-medium overflow-hidden whitespace-nowrap text-ellipsis"
            title={props.player.name}
          >
            <span class="overflow-ellipsis whitespace-nowrap overflow-hidden">
              {props.player.name}
            </span>
            <Show when={props.isMyself}>
              <div class="border border-green-400 rounded-md text-green-400 text-xs px-1.5 py-0.5">
                You
              </div>
            </Show>
          </div>
          <div class="flex items-center gap-1">
            <div
              class={`w-2 h-2 rounded-full ${
                props.player.connectionStatus === "connected"
                  ? "bg-green-400 animate-pulse"
                  : "bg-yellow-400"
              }`}
            ></div>
            <span class="text-xs text-foreground-muted capitalize">
              {props.player.connectionStatus}
            </span>
          </div>
          {/* <div class="grid grid-cols-[auto,1fr] items-center">
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
          </div> */}
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
      {/* Points indicator */}
      <div>
        <div class="relative w-full mx-auto"></div>
        <div
          class="bg-primary h-1 group-hover:h-3 duration-100 absolute left-0 bottom-0"
          style={{
            width: `${getPlayerPointsAsPercentage()}%`,
          }}
        ></div>
        <div
          class="absolute text-xs bottom-0 leading-[0.75rem] text-black font-semibold font-mono opacity-0 group-hover:opacity-100 duration-100"
          style={{
            left: `max(calc(${getPlayerPointsAsPercentage()}% + ${
              -props.player.points.toString().length - 1
            }ch), 1ch)`,
          }}
        >
          {props.player.points}
        </div>
      </div>
    </div>
  );
}
