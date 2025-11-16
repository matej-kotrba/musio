import VolumeInput from "~/components/common/audio-controller/VolumeInput";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import Timer from "~/components/game/phases/picking/components/timer/Timer";
import PlayerDisplay, { getAllIcons, PlayerToDisplay } from "~/components/game/Player";
import WordToGuess from "~/components/game/WordToGuess";

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
    <>
      <div class="flex items-center gap-2 justify-start mt-2 mb-2 w-full max-w-80 mx-auto">
        <VolumeInput value={1} onVolumeInputChange={(value) => {}} />
      </div>
      <div class="flex flex-col items-center gap-2">
        <Timer maxTime={100} currentTime={1} />

        <section class="flex flex-col items-center">
          <p class="text-xl mb-8">
            <span class="text-sm md:text-base text-foreground/35">Guess the song from</span>{" "}
            <span class="text-sm md:text-base font-semibold text-foreground/80">Dr. House</span>
          </p>
          <div class={`animate-levitate mb-4 relative`} style={{ filter: `blur(calc(12px * 1))` }}>
            <div class="absolute shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.3)] inset-0 rounded-md"></div>
            <img
              src={
                "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/60x60bb.jpg"
              }
              width={256}
              height={256}
              alt="Song to guess cover"
              class="w-32 md:w-64 aspect-square rounded-md"
            />
          </div>
          <WordToGuess wordChars={[["E", null, null, null, null], "lies".split("")]} />
        </section>
      </div>
    </>
  );
}
