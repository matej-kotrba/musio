import { Player } from "shared";
import { createEffect, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";
import { GuessingGameLeaderboardsFallback } from "~/components/game/phases/guessing/components/GuessingPhase";
import { LeaderboardsEmphasized } from "~/components/game/phases/leaderboards/components/leaderboards";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import Timer from "~/components/game/phases/picking/components/timer/Timer";
import PlayerDisplay, { getAllIcons, PlayerToDisplay } from "~/components/game/Player";

const dummy_players: PlayerToDisplay[] = [
  {
    name: "Player 1",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 95,
    publicId: "a",
    previousPoints: 85,
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 90,
    publicId: "b",
    previousPoints: 80,
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 80,
    publicId: "c",
    previousPoints: 76,
  },
  {
    name: "Player 4",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 72,
    publicId: "d",
    previousPoints: 69,
  },
  {
    name: "Player 5",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 56,
    publicId: "e",
    previousPoints: 56,
  },
  {
    name: "Player 6",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 32,
    publicId: "f",
    previousPoints: 15,
  },
];

export default function Dev() {
  return (
    <div class="w-72 mx-auto flex flex-col gap-2">
      {/* <GuessingGameLeaderboardsFallback
        prevSong={{ name: "Monody", artist: "TheFatRat" }}
        playersOrderedByPointsGained={dummy_players.toSorted((a, b) => {
          const aPoints = a.points - (a.previousPoints ?? 0);
          const bPoints = b.points - (b.previousPoints ?? 0);
          return bPoints - aPoints;
        })}
      /> */}
    </div>
  );
}
