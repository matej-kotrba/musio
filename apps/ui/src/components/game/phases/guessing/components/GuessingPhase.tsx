import { SongWithNameHidden, Song, GuessingGameState } from "shared";
import { createSignal, createEffect, Show } from "solid-js";
import WordToGuess from "~/components/game/WordToGuess";
import Timer from "../../picking/components/timer/Timer";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";
import { getGamePhaseIfValid } from "~/utils/game/common";

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
    gameStore.currentSongToGuess
  );

  const getPreviousSong: () => Maybe<Pick<Song, "name" | "artist">> = () =>
    gameStore.previousCorrectSongName && previousSong()
      ? { name: gameStore.previousCorrectSongName, artist: previousSong()!.artist }
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
          fallback={<GuessingGameLeaderboardsFallback prevSong={getPreviousSong()} />}
        >
          <section class="flex flex-col items-center">
            <p class="text-xl mb-6">
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

type GuessingGameLeaderboardsProps = {
  prevSong: Maybe<Pick<Song, "name" | "artist">>;
};

function GuessingGameLeaderboardsFallback(props: GuessingGameLeaderboardsProps) {
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
          <span class="font-bold text-foreground">{props.prevSong?.name}</span>
          <span> by </span>
          <span class="font-bold text-foreground">{props.prevSong?.artist}</span>
        </div>
      </Show>
    </div>
  );
}
