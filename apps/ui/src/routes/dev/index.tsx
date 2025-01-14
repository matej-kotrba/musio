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
  const highestScore = () => {
    let highest = 0;
    dummy_players.forEach((player) => {
      if (player.points > highest) highest > highest;
    });
    return highest;
  };

  return (
    <div class="container mx-auto mt-20">
      <div class="flex h-[200px] gap-1">
        <Index each={dummy_players}>
          {(player, idx) => {
            return <PlayerInScoreboard player={player()} height={highestScore()} />;
          }}
        </Index>
      </div>
      {/* <div class="w-fit h-[300px] grid grid-cols-3 grid-rows-4 gap-4">
        <PlayerInScoreboard player={dummy_players[1]} class="row-span-3 row-start-2 col-start-1" />
        <PlayerInScoreboard player={dummy_players[0]} class="row-span-4 col-start-2" />
        <PlayerInScoreboard player={dummy_players[2]} class="row-span-2 row-start-3 col-start-3" />
        <Index each={dummy_players}>
          {(player, idx) => {
            return <PlayerInScoreboard player={player()} index={idx} />;
          }}
        </Index>
      </div> */}
    </div>
  );
}

type PlayerInScoreboardProps = {
  player: Player;
  height: number;
  class?: string;
};

function PlayerInScoreboard(props: PlayerInScoreboardProps) {
  return <div class={clsx("", props.class)}></div>;
}

// type PlayerInScoreboardProps = {
//   player: Player;
//   class?: string;
// };

// function PlayerInScoreboard(props: PlayerInScoreboardProps) {
//   return (
//     <div class={clsx("flex", props.class)}>
//       <p class="text-ellipsis whitespace-nowrap overflow-hidden">{props.player.name}</p>
//       <div class={"bg-red-500 h-full"}>
//         <img src={props.player.icon.url} alt="" width={80} height={80} class="rounded-md" />
//         {/* <span>{props.player.name}</span> */}
//       </div>
//     </div>
//   );
// }
