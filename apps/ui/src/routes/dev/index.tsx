import styles from "./styles.module.css";
import clsx from "clsx";
import { Player } from "shared";
import { Index } from "solid-js";
import { getAllIcons } from "~/components/lobby/Player";

const dummy_players: Player[] = [
  {
    name: "Player 1",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 120,
    publicId: "",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 100,
    publicId: "",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 80,
    publicId: "",
  },
  {
    name: "Player 4",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 72,
    publicId: "",
  },
  {
    name: "Player 5",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 56,
    publicId: "",
  },
  {
    name: "Player 6",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 32,
    publicId: "",
  },
];

export default function Dev() {
  return (
    <div class="w-96 mx-auto mt-20">
      <div class="mx-auto w-fit h-[300px] grid grid-cols-3 grid-rows-8 gap-4">
        <PlayerOnTopThree player={dummy_players[1]} class="row-span-6 row-start-3 col-start-1" />
        <PlayerOnTopThree player={dummy_players[0]} class="row-span-8 col-start-2" />
        <PlayerOnTopThree player={dummy_players[2]} class="row-span-5 row-start-4 col-start-3" />
      </div>
      <div class="flex flex-col gap-1">
        <Index each={dummy_players.toSpliced(0, 3)}>
          {(player) => {
            return <PlayerBelowTopThree player={player()} />;
          }}
        </Index>
      </div>
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
        class={`${styles.leaderboards__player_name} text-ellipsis whitespace-nowrap overflow-hidden text-lg font-bold`}
        style={{ "writing-mode": "vertical-lr" }}
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
