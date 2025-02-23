import { createSignal, Show } from "solid-js";
import SongQueueProgress from "~/components/game/phases/guessing/components/SongQueueProgress";
import LobbySettings from "~/components/game/phases/lobby/components/Settings";
import { getAllIcons, PlayerToDisplay } from "~/components/game/Player";

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
  const [stepRoot, setStepRoot] = createSignal<number>(0);

  const incrementRoot = () => {
    setStepRoot((old) => old + 1);
  };

  const increment = () => {
    setStep((old) => old + 1);
  };

  return (
    <div class="w-72 mx-auto flex flex-col gap-2 mt-2">
      <button onClick={incrementRoot}>Increment root</button>
      <button onClick={increment}>Increment</button>
      <Show when={stepRoot() % 2 === 1} keyed>
        <SongQueueProgress
          stepIndex={step()}
          animateFromIndex={step() - 1}
          maxSteps={4}
          stepDescription={[
            "Dr House's song",
            "Dr House's song",
            "Dr House's song",
            "Dr House's song",
          ]}
        />
      </Show>
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
