import { Player } from "shared";
import { createEffect, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";
import { LeaderboardsEmphasized } from "~/components/game/phases/leaderboards/components/leaderboards";
import PlayerDisplay, { getAllIcons } from "~/components/game/Player";

const dummy_players: Player[] = [
  {
    name: "Player 1",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 0,
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
  // const [players, setPlayers] =
  //   createSignal<(Player & { previousPoints?: number })[]>(dummy_players);

  // function add(id: string) {
  //   setPlayers((prev) => {
  //     return prev.map((player) => {
  //       if (player.publicId === id) {
  //         return {
  //           ...player,
  //           previousPoints: player.points,
  //           points: player.points + 10,
  //         };
  //       }
  //       return player;
  //     });
  //     // .toSorted((a, b) => b.points - a.points);
  //   });
  // }

  const [players, setPlayers] =
    createStore<(Player & { previousPoints?: number })[]>(dummy_players);

  function add(publicId: string) {
    const idx = players.findIndex((player) => player.publicId === publicId);
    setPlayers(idx, { previousPoints: players[idx].points, points: players[idx].points + 10 });
    setPlayers(players.toSorted((a, b) => b.points - a.points));
  }

  return (
    <div class="w-72 mx-auto flex flex-col gap-2">
      {/* <LeaderboardsEmphasized players={dummy_players} /> */}
      <button type="button" onClick={() => setPlayers((old) => [...old, old[1]])}>
        Add
      </button>
      <TransitionGroup name="group-item">
        <For each={players}>
          {(item, index) => (
            <div class="group-item duration-300">
              {/* <button on:click={() => add(item.publicId)} type="button">
                Increment
              </button> */}
              <PlayerDisplay
                maxPoints={100}
                player={item}
                previousPoints={item.previousPoints}
                isLeading={!index()}
              />
            </div>
          )}
        </For>
      </TransitionGroup>
    </div>
  );
}
