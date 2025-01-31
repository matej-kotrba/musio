import { createSignal, Show, Switch, Match, createEffect, onCleanup } from "solid-js";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import { useParams, useNavigate } from "@solidjs/router";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import {
  GuessingGameState,
  ItunesSong,
  PickingGameState,
  Player,
  Song,
  SongWithNameHidden,
} from "shared/index.types";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { useCopyToClipboard } from "~/hooks";
import { Icon } from "@iconify-icon/solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import TextBouncy from "~/components/ui/fancy/text-bouncy";
import useWebsocket from "./services/websockets-service";
import { useGameStore, getNewGameStore } from "./stores/game-store";
import { getAllIcons, PlayerToDisplay } from "~/components/game/Player";
import ProfileSelection, { ProfileData } from "~/components/game/profile/ProfileSelection";
import PlayerList from "~/components/game/phases/shared/player-list/PlayerList";
import { toPayloadToServer, createNewMessageToServer } from "shared";
import { LeaderboardsEmphasized } from "~/components/game/phases/leaderboards/leaderboards";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import Timer from "~/components/game/phases/picking/components/timer/Timer";
import WordToGuess from "~/components/game/WordToGuess";
import { handleOnWsMessage } from "./services/on-message-handler";

const dummy_players: PlayerToDisplay[] = [
  {
    name: "Very Long cool name asd asd asd awsdasd",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 100,
    isHost: true,
    publicId: "1",
    isChecked: true,
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 89,
    isHost: false,
    publicId: "2",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 76,
    isHost: false,
    publicId: "3",
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 67,
    isHost: false,
    publicId: "4",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 56,
    isHost: false,
    publicId: "5",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 43,
    isHost: false,
    publicId: "6",
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 39,
    isHost: false,
    publicId: "7",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 6,
    isHost: false,
    publicId: "8",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 0,
    isHost: false,
    publicId: "9",
  },
];

const dummySongName = ["R", null, null, null, " ", null, null, "t", null, null, "m"];

const dummySongImage = "/2000x2000bb.jpg";

export default function Lobby() {
  const { connect, disconnect, send } = useWebsocket(handleOnWsMessage());
  const [gameStore] = useGameStore();

  const params = useParams();
  const navigate = useNavigate();

  // const ctx = useContext(WsConnectionContext);

  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);

  const lobbyId = () => params.id;

  onCleanup(() => disconnect());

  async function handleProfileSelected(data: ProfileData) {
    setProfileData(data);
    const newLobbyId = await getLobbyId(lobbyId());
    if (newLobbyId !== lobbyId()) {
      navigate(`/lobby/${newLobbyId}`, { replace: true });
    }

    await connect(newLobbyId, data);
  }

  // const handleChatMessage = (content: string) => {
  //   if (!thisPlayerIds()?.public || !getThisPlayer()) return;

  //   const newMessage: ChatMessage = {
  //     id: createUniqueId(),
  //     content: content,
  //     guessRelation: false,
  //     senderName: getThisPlayer()!.name,
  //     isOptimistic: true,
  //   };

  //   // Optimistically update messages
  //   setChatMessages((old) => [...old, newMessage]);

  //   ctx?.connection.ws?.send(
  //     toPayloadToServer(
  //       thisPlayerIds()!.private,
  //       createNewMessageToServer(lobbyId(), "CHAT_MESSAGE", {
  //         messageId: newMessage.id!,
  //         content,
  //       })
  //     )
  //   );
  // };

  const handleSongSelection = (selectedSong: ItunesSong) => {
    if (!gameStore.thisPlayerIds.private) return;

    send?.(
      toPayloadToServer(
        gameStore.thisPlayerIds.private,
        createNewMessageToServer(lobbyId(), "PICK_SONG", {
          name: selectedSong.trackName,
          artist: selectedSong.artistName,
          trackUrl: selectedSong.trackViewUrl,
          imageUrl100x100: selectedSong.artworkUrl100,
        })
      )
    );
  };

  return (
    <>
      <ProfileSelection onProfileSelected={handleProfileSelected} />
      <div
        class="relative"
        style={{
          "--custom-height": `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
          height: `calc(var(--custom-height) + ${LOBBY_LAYOUT_HEIGHT} * 2)`,
        }}
      >
        <div class="grid grid-cols-[auto,1fr,auto] gap-4 py-4 overflow-hidden">
          {/* Player sidebar */}
          <PlayerList shouldShow={!!profileData()} />
          {/* ___ */}
          {/* <Switch>
            <Match when={gameStore.gameState.state === "lobby"}>
              
            </Match>
            <Match when={gameState().state === "picking"}>
              <PickingGamePhase
                gameState={gameState() as PickingGameState}
                didPick={didPick()}
                players={players()}
                handleSongSelection={handleSongSelection}
              />
            </Match>
            <Match when={gameState().state === "guessing"}> */}
          {/* <Show when={!!profileData()} fallback={<p>Selecting...</p>}> */}
          {/* <GuessingGamePhase
                gameState={gameState() as GuessingGameState}
                currentSongToGuess={currentSongToGuess()}
                currentSongByPlayer={
                  currentSongToGuess() &&
                  getPlayerByPublicId(currentSongToGuess()!.fromPlayerByPublicId)
                }
                previousSongName={previousCorrectSongName()}
              /> */}
          {/* </Show> */}
          {/* </Match>
            <Match when={gameState().state === "leaderboard"}>
              <LeaderboardsGamePhase
                players={players()}
                isThisPlayerHost={getThisPlayer()?.isHost}
              />
            </Match>
          </Switch> */}
          {/* <aside
            class="h-full max-h-full w-80"
            style={{
              height: "var(--custom-height)",
            }}
          >
            <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
              <Chat
                messages={chatMessages()}
                onChatMessage={handleChatMessage}
                disabled={currentSongToGuess()?.fromPlayerByPublicId === thisPlayerIds()?.public}
              />
            </Show>
          </aside> */}
        </div>
      </div>
    </>
  );
}

type PickingGamePhaseProps = {
  gameState: PickingGameState;
  players: Player[];
  didPick: boolean;
  handleSongSelection: (selectedSong: ItunesSong) => void;
};

function PickingGamePhase(props: PickingGamePhaseProps) {
  return (
    <div class="flex flex-col items-center">
      <Timer
        maxTime={props.gameState.initialTimeRemainingInSec}
        currentTime={props.gameState.initialTimeRemainingInSec}
      />
      <Show
        when={!props.didPick}
        fallback={
          <div class="mt-2">
            <div class="text-center font-bold text-4xl mb-2">
              {props.players.filter((player) => player.isChecked).length}/{props.players.length}
            </div>
            <TextBouncy text="Waiting for others to pick!" class="font-bold text-2xl" />
          </div>
        }
      >
        <SongPicker onSongSelect={props.handleSongSelection} />
      </Show>
    </div>
  );
}

type GuessingGamePhaseProps = {
  gameState: GuessingGameState;
  currentSongByPlayer?: Player;
  currentSongToGuess?: SongWithNameHidden;
  previousSongName?: string;
};

function GuessingGamePhase(props: GuessingGamePhaseProps) {
  const [blurRatio, setBlurRatio] = createSignal<number>(
    props.gameState.currentInitialTimeRemaining / props.gameState.initialTimeRemaining
  );
  const [previousSong, setPreviousSong] = createSignal<Maybe<SongWithNameHidden>>(
    props.currentSongToGuess
  );

  const getPreviousSong: () => Maybe<Pick<Song, "name" | "artist">> = () =>
    props.previousSongName && previousSong()
      ? { name: props.previousSongName, artist: previousSong()!.artist }
      : undefined;

  function handleTimeChange(current: number) {
    const base = current / props.gameState.initialTimeRemaining;
    const pow = base ** 2;
    setBlurRatio(base + (base - pow));
  }

  createEffect(() => {
    if (props.currentSongToGuess) {
      setPreviousSong(props.currentSongToGuess);
    }
  });

  return (
    <>
      <div class="flex flex-col items-center gap-2">
        <Timer
          maxTime={
            props.currentSongToGuess
              ? props.gameState.initialTimeRemaining
              : props.gameState.initialDelay
          }
          currentTime={
            props.currentSongToGuess
              ? props.gameState.initialTimeRemaining
              : props.gameState.initialDelay
          }
          onTimeChange={handleTimeChange}
        />
        <Show
          when={props.currentSongToGuess}
          fallback={<GuessingGameLeaderboardsFallback prevSong={getPreviousSong()} />}
        >
          <section class="flex flex-col items-center">
            <p class="text-xl mb-6">
              <span class="text-foreground/35">Guess the song from</span>{" "}
              <span class="font-semibold text-foreground/80">
                {props.currentSongByPlayer?.name ?? "Unknown"}
              </span>
            </p>
            <div
              class={`animate-levitate mb-4 relative`}
              style={{ filter: `blur(calc(12px * ${blurRatio()}))` }}
            >
              <div class="absolute shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.3)] inset-0 rounded-md"></div>
              <img
                src={props.currentSongToGuess!.imageUrl100x100}
                width={256}
                height={256}
                alt="Song to guess cover"
                class="w-64 aspect-square rounded-md"
              />
            </div>
            <WordToGuess wordChars={props.currentSongToGuess!.name} />
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

type LeaderboardsGamePhaseProps = {
  players: Player[];
  isThisPlayerHost?: boolean;
};

function LeaderboardsGamePhase(props: LeaderboardsGamePhaseProps) {
  return (
    <>
      <div class="px-2 mt-8">
        <Show when={props.isThisPlayerHost || true}>
          <Button class="ml-auto flex items-center gap-1">
            <span class="font-bold">Next round</span>{" "}
            <Icon icon="mingcute:repeat-fill" class="text-xl" />
          </Button>
        </Show>
        <LeaderboardsEmphasized players={props.players} />
      </div>
    </>
  );
}

// {
//   state: "guessing",
//   initialTimeRemaining: 30,
//   currentInitialTimeRemaining: 30,
//   playersWhoGuessed: [],
//   initialDelay: 5,
//   isGuessingPaused: true,
//   startTime: 0,
// }

// {
//   artist: "TheFatRat",
//   name: [
//     ["N", "o", "b", null, null, null, null],
//     ["C", null, null, null, null, null, null],
//     [null, null],
//     [null, null, null],
//     [null, null, null, null, null],
//   ],
//   fromPlayerByPublicId: "asd",
//   trackUrl:
//     "https://music.apple.com/us/album/monody-feat-laura-brehm-radio-edit/1444888726?i=1444888936&uo=4",
//   imageUrl100x100:
//     "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/100x100bb.jpg",
// }
