import { SongWithNameHidden, Song, GuessingGameState, Player } from "shared";
import { createSignal, createEffect, Show, For } from "solid-js";
import WordToGuess from "~/components/game/WordToGuess";
import Timer from "../../picking/components/timer/Timer";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";
import { getGamePhaseIfValid } from "~/utils/game/common";
import { Motion } from "solid-motionone";
import SongQueueProgress from "./SongQueueProgress";

export default function GuessingGamePhase() {
  const [gameStore] = useGameStore();

  return (
    <Show when={getGamePhaseIfValid<GuessingGameState>(gameStore.gameState, "guessing")}>
      {(guessingPhase) => <GuessingGamePhaseInner gameState={guessingPhase()} />}
    </Show>
  );
}

type GuessingGamePhaseInnerProps = {
  gameState: GuessingGameState;
};

function GuessingGamePhaseInner(props: GuessingGamePhaseInnerProps) {
  const [gameStore, { queries }] = useGameStore();
  const { getPlayerByPublicId } = queries;

  const [blurRatio, setBlurRatio] = createSignal<number>(
    props.gameState.currentInitialTimeRemaining / props.gameState.initialTimeRemaining
  );
  const [previousSong, setPreviousSong] = createSignal<Maybe<SongWithNameHidden>>(
    // {
    //   artist: "TheFatRat",
    //   fromPlayerByPublicId: "",
    //   imageUrl100x100: "",
    //   name: [],
    //   trackUrl: "",
    // }
    gameStore.currentSongToGuess
  );

  const getPreviousSong: () => Maybe<
    Pick<Song, "artist"> & { playerName: string; songName: string }
  > = () =>
    gameStore.previousSongData && previousSong()
      ? {
          songName: gameStore.previousSongData.correctSongName,
          artist: previousSong()!.artist,
          playerName: getPlayerByPublicId(previousSong()!.fromPlayerByPublicId)?.name || "Unknown",
        }
      : undefined;

  const getPlayerWhoRequestedCurrentSong = () => {
    if (!gameStore.currentSongToGuess) return;
    return getPlayerByPublicId(gameStore.currentSongToGuess.fromPlayerByPublicId);
  };

  function handleTimeChange(current: number) {
    const base = current / props.gameState.initialTimeRemaining;
    const pow = base ** 2;
    setBlurRatio(base + (base - pow));
  }

  function getPlayersPreviousSongPointGains(): PlayerOrderedByPointsGained[] {
    const playersWhoGainedPoints: PlayerOrderedByPointsGained[] = gameStore
      .previousSongData!.pointsPerPlayers.toSorted((a, b) => {
        return b.points - a.points;
      })
      .map((player) => {
        const temp = getPlayerByPublicId(player.publicId);
        if (!temp) return undefined;

        return {
          name: temp.name,
          icon: temp.icon,
          pointsGained: player.points,
        };
      })
      .filter((x) => !!x);

    const restPlayers: PlayerOrderedByPointsGained[] = gameStore.players
      .filter(
        (player) =>
          !gameStore
            .previousSongData!.pointsPerPlayers.map((player) => player.publicId)
            .includes(player.publicId)
      )
      .map((player) => ({ name: player.name, icon: player.icon, pointsGained: 0 }));

    return [...playersWhoGainedPoints, ...restPlayers];
  }

  createEffect(() => {
    if (gameStore.currentSongToGuess) {
      setPreviousSong(gameStore.currentSongToGuess);
    }
  });

  return (
    <>
      <div class="flex flex-col items-center gap-2">
        <Timer
          maxTime={
            gameStore.currentSongToGuess
              ? props.gameState.initialTimeRemaining
              : props.gameState.initialDelay
          }
          currentTime={
            gameStore.currentSongToGuess
              ? props.gameState.initialTimeRemaining
              : props.gameState.initialDelay
          }
          onTimeChange={handleTimeChange}
        />
        <Show
          when={gameStore.currentSongToGuess}
          fallback={
            <GuessingGameLeaderboardsFallback
              prevSong={getPreviousSong()}
              playersOrderedByPointsGained={getPlayersPreviousSongPointGains()}
            />
          }
        >
          <section class="flex flex-col items-center">
            <p class="text-xl mb-8">
              <span class="text-foreground/35">Guess the song from</span>{" "}
              <span class="font-semibold text-foreground/80">
                {getPlayerWhoRequestedCurrentSong()?.name ?? "Unknown"}
              </span>
            </p>
            <div
              class={`animate-levitate mb-4 relative`}
              style={{ filter: `blur(calc(12px * ${blurRatio()}))` }}
            >
              <div class="absolute shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.3)] inset-0 rounded-md"></div>
              <img
                src={gameStore.currentSongToGuess!.imageUrl100x100}
                width={256}
                height={256}
                alt="Song to guess cover"
                class="w-64 aspect-square rounded-md"
              />
            </div>
            <WordToGuess wordChars={gameStore.currentSongToGuess!.name} />
          </section>
        </Show>
      </div>
    </>
  );
}

type PlayerOrderedByPointsGained = { name: string; icon: Player["icon"]; pointsGained: number };

type GuessingGameLeaderboardsProps = {
  prevSong: Maybe<Pick<Song, "artist"> & { songName: string; playerName: string }>;
  playersOrderedByPointsGained: PlayerOrderedByPointsGained[];
};

export function GuessingGameLeaderboardsFallback(props: GuessingGameLeaderboardsProps) {
  const [gameStore, { queries }] = useGameStore();
  const { getPlayerByPublicId } = queries;
  // let ref!: HTMLDivElement;
  // const [heightTopOffsetCSS, setHeightTopOffsetCSS] = createSignal<string>("");

  // createEffect(() => {
  //   if (!ref) return;
  //   const rect = ref.getBoundingClientRect();
  //   setHeightTopOffsetCSS(`${rect.top}px + ${NAV_HEIGHT}`);
  //   console.log(`${rect.top}px + ${NAV_HEIGHT}`);
  // });

  return (
    <div class="max-w-96">
      <div class="font-bold text-lg text-foreground text-center mb-2">
        {props.prevSong ? "Next round starting soon..." : "Get ready, starting soon..."}
      </div>
      <Show when={props.prevSong}>
        <div class="text-foreground/80 text-center">
          <span>Last song: </span>
          <span class="font-bold text-foreground">{props.prevSong?.songName}</span>
          <span> by </span>
          <span class="font-bold text-foreground">{props.prevSong?.artist}</span>
        </div>
        <div class="text-foreground/80 text-center">
          <span>Requested by: </span>
          <span class="text-foreground font-bold">{props.prevSong?.playerName}</span>
        </div>
        <div class="flex flex-col gap-1 mt-2">
          <For each={props.playersOrderedByPointsGained}>
            {(player, index) => (
              <Motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index() * 0.15 }}
                class="flex gap-1 items-center"
              >
                <img
                  src={player.icon.url}
                  width={48}
                  height={48}
                  alt={player.icon.name}
                  class=" rounded-lg"
                />
                <div class="flex-1 flex justify-between">
                  <span class="font-semibold">{player.name}</span>
                  <span class="text-green-600">+{player.pointsGained}</span>
                </div>
              </Motion.div>
            )}
          </For>
        </div>
      </Show>
      <div class="mt-4"></div>
      <Show when={gameStore.delaySongProgress}>
        {(songProgress) => {
          return (
            <SongQueueProgress
              maxSteps={songProgress().songsInQueueByPlayerPublicIds.length}
              stepIndex={songProgress().currentIndex}
              animateFromIndex={
                songProgress().currentIndex - 1 >= 0 ? songProgress().currentIndex - 1 : 0
              }
              stepDescription={songProgress().songsInQueueByPlayerPublicIds.map((publicId) => {
                return `${getPlayerByPublicId(publicId)?.name ?? "Unknown player"}'s song`;
              })}
            />
          );
        }}
      </Show>
    </div>
  );
}
