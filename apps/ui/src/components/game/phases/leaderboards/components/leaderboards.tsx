import { Icon } from "@iconify-icon/solid";
import clsx from "clsx";
import { Player } from "shared";
import { Index, Show } from "solid-js";
import { Motion } from "solid-motionone";

type LeaderboardsProps = {
  players: Player[];
};

export function LeaderboardsEmphasized(props: LeaderboardsProps) {
  return (
    <div>
      <div class="mx-auto w-fit h-[300px] grid grid-cols-3 grid-rows-8 gap-4">
        {props.players[1] && (
          <PlayerOnTopThree player={props.players[1]} class="row-span-6 row-start-3 col-start-1" />
        )}
        {props.players[0] && (
          <PlayerOnTopThree player={props.players[0]} class="row-span-8 col-start-2" isFirst />
        )}
        {props.players[2] && (
          <PlayerOnTopThree player={props.players[2]} class="row-span-5 row-start-4 col-start-3" />
        )}
      </div>
      <div class="flex flex-col gap-1">
        <Index each={props.players.toSpliced(0, 3)}>
          {(player, index) => {
            return (
              <Motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, easing: "ease", delay: 2.5 + index * 0.25 }}
              >
                <PlayerBelowTopThree player={player()} />
              </Motion.div>
            );
          }}
        </Index>
      </div>
    </div>
  );
}

type PlayerComponentProps = {
  player: Player;
  isFirst?: boolean;
  class?: string;
};

function PlayerOnTopThree(props: PlayerComponentProps) {
  return (
    <div class={clsx("flex", props.class)}>
      <Motion.div
        class={"from-transparent to-primary/80 bg-gradient-to-t h-full rounded-t-md origin-bottom"}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, easing: "ease-out" }}
      >
        <Show when={props.isFirst}>
          <Motion.div>
            <Icon
              icon={"solar:crown-bold"}
              class="absolute bottom-[calc(100%+6px)] left-[calc(50%-4px)] -translate-x-1/2 text-xl text-yellow-400 bg-secondary p-1 rounded-full motion-preset-seesaw-lg"
              style={{ filter: "drop-shadow(0 0 2px yellow)" }}
            />
          </Motion.div>
        </Show>
        <Motion.img
          src={props.player.icon.url}
          alt=""
          width={96}
          height={96}
          class="w-24 aspect-square rounded-md shadow-lg shadow-black/50 -translate-x-1"
          initial={{ opacity: 0, y: -40, x: -40 }}
          animate={{ opacity: 1, y: -4, x: -4 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, easing: "ease" }}
          class="text-center font-bold text-xl motion-preset-seesaw-md"
          style={{ "animation-delay": `${Math.random()}s` }}
        >
          {props.player.points}
        </Motion.div>
      </Motion.div>
      <Motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, easing: "ease" }}
      >
        <p
          class={`h-full w-full min-w-[28px] text-ellipsis whitespace-nowrap overflow-hidden text-lg font-bold`}
          style={{
            "writing-mode": "vertical-lr",
            "-webkit-writing-mode": "vertical-lr",
            "-ms-writing-mode": "vertical-lr",
            "text-orientation": "mixed",
            "-webkit-text-orientation": "mixed",
            mask: "linear-gradient(to bottom, black, transparent 120%)",
          }}
          title={props.player.name}
        >
          {props.player.name}
        </p>
      </Motion.div>
    </div>
  );
}

function PlayerBelowTopThree(props: PlayerComponentProps) {
  return (
    <div
      class={clsx(
        `w-full bg-background-DEAFULT relative flex justify-between p-4 border-foreground/25 border rounded-lg isolate overflow-hidden`,
        props.class
      )}
      style={{ "scroll-margin": "10px" }}
    >
      <img
        src={props.player.icon.url}
        alt=""
        width={64}
        height={64}
        class="absolute w-16 aspect-square rounded-md left-0 top-1/2 -translate-y-1/2 -z-10"
        style={{ mask: "linear-gradient(to right, black, transparent)" }}
      />
      <span class="pl-12 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80%]">
        {props.player.name}
      </span>
      <span class="font-bold">{props.player.points}</span>
    </div>
  );
}
