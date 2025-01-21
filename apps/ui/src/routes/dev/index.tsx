import { Player } from "shared";
import { createEffect, createSignal, For } from "solid-js";
import { LeaderboardsEmphasized } from "~/components/lobby/leaderboards/leaderboards";
import SongPicker from "~/components/lobby/picking-phase/SongPicker";
import PlayerDisplay, { getAllIcons } from "~/components/lobby/Player";

const dummy_players: Player[] = [
  {
    name: "Player 1",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 120,
    publicId: "a",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 100,
    publicId: "b",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 80,
    publicId: "c",
  },
  {
    name: "Player 4",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 72,
    publicId: "d",
  },
  {
    name: "Player 5",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 56,
    publicId: "e",
  },
  {
    name: "Player 6",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 32,
    publicId: "f",
  },
];

export default function Dev() {
  const [players, setPlayers] = createSignal(dummy_players);

  function add(id: string) {
    setPlayers((prev) => {
      return prev
        .map((player) => {
          if (player.publicId === id) {
            return {
              ...player,
              points: player.points + 10,
            };
          }
          return player;
        })
        .toSorted((a, b) => b.points - a.points);
    });
  }

  return (
    <div class="w-72 mx-auto flex flex-col gap-2">
      <For each={players()}>
        {(item, index) => (
          <button on:click={() => add(item.publicId)} type="button">
            <PlayerDisplay maxPoints={100} player={item} isLeading={!index()} />
          </button>
        )}
      </For>
    </div>
  );
}
