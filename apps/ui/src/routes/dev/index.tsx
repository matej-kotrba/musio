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
];

export default function Dev() {
  return (
    <div class="container mx-auto mt-20">
      <div class="w-[400px] grid grid-cols-[repeat(3,1fr)] grid-rows-3 gap-2">
        <PlayerInScoreboard player={dummy_players[1]} class={"rpw-span"} />
        <PlayerInScoreboard player={dummy_players[0]} />
        <PlayerInScoreboard player={dummy_players[2]} />
        {/* <Index each={dummy_players}>
          {(player, idx) => {
            return <PlayerInScoreboard player={player()} index={idx} />;
          }}
        </Index> */}
      </div>
    </div>
  );
}

type PlayerInScoreboardProps = {
  player: Player;
  class?: CSSModuleClasses;
};

function PlayerInScoreboard(props: PlayerInScoreboardProps) {
  return (
    <div class={clsx("bg-red-500", props.class)}>
      <img src={props.player.icon.url} alt="" width={80} height={80} class="rounded-md" />
      {/* <span>{props.player.name}</span> */}
    </div>
  );
}
