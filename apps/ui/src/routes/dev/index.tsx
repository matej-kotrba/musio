import { For } from "solid-js";
import { Motion } from "solid-motionone";
import VolumeInput from "~/components/common/audio-controller/VolumeInput";
import SongQueueProgress from "~/components/game/phases/guessing/components/SongQueueProgress";
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
    <div class="w-full max-w-96">
      <div class="font-bold text-base md:text-lg text-foreground text-center mb-2">
        {"Get ready, starting soon..."}
      </div>
      <div>
        <img
          class="w-24 md:w-32 aspect-square rounded-sm mx-auto my-2"
          src={
            "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/60x60bb.jpg"
          }
        />
      </div>
      <div class="text-foreground/80 text-center text-sm md:text-base">
        <span>Last song: </span>
        <span class="font-bold text-foreground">{"Rock bottom"}</span>
        <span> by </span>
        <span class="font-bold text-foreground">{"Hailee Steinfield"}</span>
      </div>
      <div class="text-foreground/80 text-center text-sm md:text-base">
        <span>Requested by: </span>
        <span class="text-foreground font-bold">{"Dr. House"}</span>
      </div>
      <div class="mt-2 md:mt-4 text-center md:text-right text-sm md:text-base">
        <div>
          Audio previews and metadata provided by <span class="font-bold">iTunes</span>.
        </div>
        <div>
          <a class="text-blue-500 underline" href={""} target="_blank">
            Download song on iTunes
          </a>
        </div>
      </div>
      <div class="flex flex-col gap-1 mt-2 px-1 max-h-28 md:max-h-full overflow-y-auto md:overflow-y-visible">
        <For each={[{}, {}, {}, {}]}>
          {(player, index) => (
            <Motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index() * 0.15 }}
              class="flex gap-1 items-center"
            >
              <img
                src={
                  "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/60x60bb.jpg"
                }
                width={48}
                height={48}
                alt={"name"}
                class=" rounded-lg"
              />
              <div class="flex-1 flex justify-between">
                <span class="font-semibold">{"Player 1"}</span>
                <span class="text-green-600">+{3}</span>
              </div>
            </Motion.div>
          )}
        </For>
      </div>
      <div class="hidden md:block mt-4">
        {/* {(songProgress) => {
            return (
              <>
                <SongQueueProgress
                  maxSteps={songProgress.songsInQueueByPlayerPublicIds.length}
                  stepIndex={songProgress.currentIndex}
                  animateFromIndex={
                    songProgress.currentIndex - 1 >= 0 ? songProgress.currentIndex - 1 : 0
                  }
                  stepDescription={songProgress.songsInQueueByPlayerPublicIds.map(() => {
                    return `asda`;
                  })}
                />
              </>
            );
          }} */}
      </div>
    </div>
  );
}
