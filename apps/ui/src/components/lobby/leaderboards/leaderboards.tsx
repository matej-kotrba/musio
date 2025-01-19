import clsx from "clsx";
import { Player } from "shared";
import { Index } from "solid-js";

type LeaderboardsProps = {
  players: Player[];
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
    <div class="flex flex-col gap-1">
      <Index each={props.players}>
        {(player) => {
          return <PlayerBelowTopThree player={player()} />;
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
      <div class={"from-transparent to-primary/80 bg-gradient-to-t h-full rounded-t-md"}>
        <img
          src={props.player.icon.url}
          alt=""
          width={96}
          height={96}
          class="w-24 aspect-square rounded-md shadow-lg shadow-black/50 -translate-x-1 -translate-y-1"
        />
      </div>
      <p
        class={`text-ellipsis whitespace-nowrap overflow-hidden text-lg font-bold`}
        style={{
          "writing-mode": "vertical-lr",
          mask: "linear-gradient(to bottom, black, transparent)",
        }}
        title={props.player.name}
      >
        {props.player.name}
      </p>
    </div>
  );
}

function PlayerBelowTopThree(props: PlayerComponentProps) {
  return (
    <div class="relative p-4 border-foreground/25 border rounded-lg isolate overflow-hidden">
      <img
        src={props.player.icon.url}
        alt=""
        width={64}
        height={64}
        class="absolute w-16 aspect-square rounded-md left-0 top-1/2 -translate-y-1/2 -z-10"
        style={{ mask: "linear-gradient(to right, black, transparent)" }}
      />
      <p class="pl-12 overflow-hidden text-ellipsis whitespace-nowrap">{props.player.name}</p>
    </div>
  );
}
