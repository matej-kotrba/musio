import clsx from "clsx";
import { Player } from "shared";
import { Index } from "solid-js";
import { Motion } from "solid-motionone";

type LeaderboardsProps = {
  players: Player[];
  maxHeightCSS?: string;
  ref?: HTMLDivElement;
};

export function LeaderboardsEmphasized(props: LeaderboardsProps) {
  return (
    <div>
      <div class="mx-auto w-fit h-[300px] grid grid-cols-3 grid-rows-8 gap-4">
        <PlayerOnTopThree player={props.players[1]} class="row-span-6 row-start-3 col-start-1" />
        <PlayerOnTopThree player={props.players[0]} class="row-span-8 col-start-2" />
        <PlayerOnTopThree player={props.players[2]} class="row-span-5 row-start-4 col-start-3" />
      </div>
      <div class="flex flex-col gap-1">
        <Index each={props.players.toSpliced(0, 3)}>
          {(player) => {
            return <PlayerBelowTopThree player={player()} />;
          }}
        </Index>
      </div>
    </div>
  );
}

export function Leaderboards(props: LeaderboardsProps) {
  return (
    <div
      ref={props.ref}
      class="w-full bg-secondary p-2 rounded-sm overflow-y-auto snap-y snap-mandatory space-y-1"
      style={{
        height: props.maxHeightCSS ?? "100%",
      }}
    >
      <Index each={props.players}>
        {(player) => {
          return <PlayerBelowTopThree player={player()} class="snap-start" />;
        }}
      </Index>
    </div>
  );
}

type PlayerComponentProps = {
  player: Player;
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
        <Motion.img
          src={props.player.icon.url}
          alt=""
          width={96}
          height={96}
          class="w-24 aspect-square rounded-md shadow-lg shadow-black/50 -translate-x-1"
          initial={{ opacity: 0, y: -40, x: -4 }}
          animate={{ opacity: 1, y: -4, x: -4 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        <div class="text-center font-bold text-xl">{props.player.points}</div>
      </Motion.div>
      <Motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, easing: "ease" }}
      >
        <p
          class={`w-full text-ellipsis whitespace-nowrap overflow-hidden text-lg font-bold`}
          style={{
            "writing-mode": "vertical-lr",
            mask: "linear-gradient(to bottom, black, transparent 140%)",
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
