import { Player } from "shared";
import { createEffect, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";
import { LeaderboardsEmphasized } from "~/components/game/phases/leaderboards/components/leaderboards";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
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
  return (
    <div class="w-72 mx-auto flex flex-col gap-2">
      <SongPicker onSongSelect={() => {}} />
    </div>
  );
}
