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
    <div class="container mx-auto mt-20">
      <div class="mx-auto w-fit h-[300px] grid grid-cols-3 grid-rows-4 gap-4">
        <PlayerOnTopThree player={dummy_players[1]} class="row-span-3 row-start-2 col-start-1" />
        <PlayerOnTopThree player={dummy_players[0]} class="row-span-4 col-start-2" />
        <PlayerOnTopThree player={dummy_players[2]} class="row-span-2 row-start-3 col-start-3" />
      </div>
      <Index each={dummy_players.toSpliced(0, 3)}>
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
      <p
        class={`${styles.leaderboards__player_name} [writing-mode:sideways-lr] text-ellipsis whitespace-nowrap overflow-hidden text-lg font-bold`}
      >
        {props.player.name}
      </p>
      <div class={"from-transparent to-primary/80 bg-gradient-to-t h-full rounded-t-md"}>
        <img
          src={props.player.icon.url}
          alt=""
          width={96}
          height={96}
          class="w-24 aspect-square rounded-md shadow-lg shadow-black/50 translate-x-1"
        />
      </div>
    </div>
  );
}

function PlayerBelowTopThree(props: PlayerComponentProps) {
  return <div>{props.player.name}</div>;
}
