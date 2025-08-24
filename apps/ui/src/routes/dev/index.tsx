import { Player } from "shared";
import { createEffect, createSignal, Show } from "solid-js";
import SongQueueProgress from "~/components/game/phases/guessing/components/SongQueueProgress";
import LobbySettings from "~/components/game/phases/lobby/components/Settings";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import PlayerList from "~/components/game/phases/shared/player-list/PlayerList";
import PlayerDisplay, { getAllIcons, PlayerToDisplay } from "~/components/game/Player";
import { useGameStore } from "../lobby/stores/game-store";

const dummy_players: PlayerToDisplay[] = [
  {
    name: "Player 1",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 5,
    publicId: "a",
    previousPoints: 85,
    status: "connected",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 100,
    publicId: "b",
    previousPoints: 80,
    status: "connected",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 80,
    publicId: "c",
    previousPoints: 76,
    status: "connected",
  },
  {
    name: "Player 4",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 72,
    publicId: "d",
    previousPoints: 69,
    status: "connected",
  },
  // {
  //   name: "Player 5",
  //   icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
  //   isHost: false,
  //   points: 56,
  //   publicId: "e",
  //   previousPoints: 56,
  //   status: "connected",
  // },
  // {
  //   name: "Player 6",
  //   icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
  //   isHost: false,
  //   points: 32,
  //   publicId: "f",
  //   previousPoints: 15,
  //   status: "connected",
  // },
];

// const dummy_player: PlayerToDisplay = {
//   name: "Player 1",
//   icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
//   isHost: true,
//   points: 95,
//   publicId: "a",
//   previousPoints: 85,
//   status: "disconnected",
// };

export default function Dev() {
  const [gameStore, { actions }] = useGameStore();

  createEffect(() => {
    actions.setGameStore("gameOptions", "toPointsLimit", 100);
  });
  // const [step, setStep] = createSignal<number>(0);
  // const [stepRoot, setStepRoot] = createSignal<number>(0);

  // const incrementRoot = () => {
  //   setStepRoot((old) => old + 1);
  // };

  // const increment = () => {
  //   setStep((old) => old + 1);
  // };

  return (
    <div class="w-72 mx-auto flex flex-col gap-2 mt-2">
      <PlayerList players={dummy_players} />
      {/* <LobbySettings gameLimit={20} playerLimit={4}>
        Open
      </LobbySettings> */}
      {/* <PlayerDisplay player={dummy_player} maxPoints={100} /> */}
      {/* <SongPicker onSongSelect={() => {}} /> */}
      {/* <button onClick={incrementRoot}>Increment root</button>
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
