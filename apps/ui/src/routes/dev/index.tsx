import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import Timer from "~/components/game/phases/picking/components/timer/Timer";
import PlayerDisplay, { getAllIcons, PlayerToDisplay } from "~/components/game/Player";

const dummy_players: PlayerToDisplay[] = [
  {
    name: "Player 1",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 10,
    publicId: "a",
    previousPoints: 85,
    connectionStatus: "connected",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 100,
    publicId: "b",
    previousPoints: 80,
    connectionStatus: "connected",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: false,
    points: 80,
    publicId: "c",
    previousPoints: 76,
    connectionStatus: "connected",
  },
  {
    name: "Player 4",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    isHost: true,
    points: 72,
    publicId: "d",
    previousPoints: 69,
    connectionStatus: "connected",
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
  return (
    <div class="relative flex flex-col items-center">
      <div class="block md:absolute right-1 top-1">
        Players ready: {0}/{2}
      </div>
      <Timer maxTime={10} currentTime={1} />

      <SongPicker onSongSelect={() => {}} />
    </div>
  );
}
