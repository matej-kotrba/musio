import { Player } from "shared";
import { createEffect, createSignal } from "solid-js";
import { Leaderboards, LeaderboardsEmphasized } from "~/components/lobby/leaderboards/leaderboards";
import SongPicker from "~/components/lobby/picking-phase/SongPicker";
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
    <div class="w-96 mx-auto">
      <SongPicker onSongSelect={() => {}} />
      <LeaderboardsEmphasized players={dummy_players} />
    </div>
  );
}
