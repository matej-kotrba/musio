import { Player } from "shared";
import { createEffect, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";
import { GuessingGameLeaderboardsFallback } from "~/components/game/phases/guessing/components/GuessingPhase";
import SongQueueProgress from "~/components/game/phases/guessing/components/SongQueueProgress";
import {
  LeaderboardsEmphasized,
  LeaderboardsSimple,
} from "~/components/game/phases/leaderboards/components/leaderboards";
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
  const [step, setStep] = createSignal<number>(0);

  function increment() {
    setStep((old) => old + 1);
  }

  return (
    <div class="w-72 mx-auto flex flex-col gap-2 mt-2">
      <LeaderboardsSimple players={dummy_players} />
      {/* <button onClick={increment}>Increment</button> */}
      {/* <Show when={step()}>
        {(s) => {
          return (
            <SongQueueProgress
              stepIndex={3}
              animateFromIndex={3 - 1 >= 0 ? 3 - 1 : 0}
              maxSteps={4}
              stepDescription={[
                "Dr House's song",
                "Dr House's song",
                "Dr House's song",
                "Dr House's song",
              ]}
            />
          );
        }}
      </Show> */}
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
