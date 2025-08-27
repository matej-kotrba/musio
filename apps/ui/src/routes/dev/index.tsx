import styles from "./styles.module.css";
import { Player } from "shared";
import { createEffect, createSignal, ErrorBoundary, Match, Show, Switch } from "solid-js";
import SongQueueProgress from "~/components/game/phases/guessing/components/SongQueueProgress";
import LobbySettings from "~/components/game/phases/lobby/components/Settings";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import PlayerList from "~/components/game/phases/shared/player-list/PlayerList";
import PlayerDisplay, { getAllIcons, PlayerToDisplay } from "~/components/game/Player";
import { useGameStore } from "../lobby/stores/game-store";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import LobbyPhase from "~/components/game/phases/lobby/components/LobbyPhase";
import PickingPhase from "~/components/game/phases/picking/components/PickingPhase";
import GuessingGamePhase from "~/components/game/phases/guessing/components/GuessingPhase";
import LeaderboardsGamePhase from "~/components/game/phases/leaderboards/components/LeaderboardsPhase";
import LobbyChat from "~/features/lobbyChat/LobbyChat";
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
  const [step, setStep] = createSignal<number>(0);
  const [stepRoot, setStepRoot] = createSignal<number>(0);

  const incrementRoot = () => {
    setStepRoot((old) => old + 1);
  };

  const increment = () => {
    setStep((old) => old + 1);
  };

  createEffect(() => {
    console.log(step());
  });

  return (
    <div class="container mx-auto">
      {/* <div class="w-72 mx-auto flex flex-col gap-2 mt-2">*/}
      {/* <LobbySettings gameLimit={20} playerLimit={4}>
        Open
      </LobbySettings> */}
      {/* <PlayerDisplay player={dummy_player} maxPoints={100} /> */}
      {/* <SongPicker onSongSelect={() => {}} /> */}
      <button onClick={incrementRoot} class="border">
        Increment root
      </button>
      <button onClick={increment}>Increment</button>
      {/* <Show when={stepRoot() % 2 === 1} keyed> */}
      <SongQueueProgress
        stepIndex={step()}
        animateFromIndex={step() - 1}
        maxSteps={1}
        stepDescription={[
          "Dr House's song",
          "Dr House's song",
          "Dr House's song",
          "Dr House's song",
        ]}
      />
      {/* </Show> */}
      {/* <GuessingGameLeaderboardsFallback
        prevSong={{ name: "Monody", artist: "TheFatRat" }}
        playersOrderedByPointsGained={dummy_players.toSorted((a, b) => {
          const aPoints = a.points - (a.previousPoints ?? 0);
          const bPoints = b.points - (b.previousPoints ?? 0);
          return bPoints - aPoints;
        })}
      /> */}
      {/*</div>*/}
    </div>
  );
}

function LobbyErrorBoundary() {
  return <div>Something went wrong</div>;
}
