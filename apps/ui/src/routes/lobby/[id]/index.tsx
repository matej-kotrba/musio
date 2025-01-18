import styles from "./index.module.css";
import {
  createSignal,
  Show,
  useContext,
  Switch,
  Match,
  createEffect,
  createUniqueId,
} from "solid-js";
import PlayerDisplay, { getAllIcons } from "~/components/lobby/Player";
import WordToGuess from "~/components/lobby/WordToGuess";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import Chat from "~/components/lobby/chat/Chat";
import { isWsConnectionContext, WsConnectionContext } from "~/contexts/connection";
import { useParams, useNavigate } from "@solidjs/router";
import ProfileSelection, { ProfileData } from "~/components/lobby/profile/ProfileSelection";
import { createNewMessageToServer, fromMessage, toPayloadToServer } from "shared";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import {
  ChatMessage,
  GameState,
  GuessChatMessageType,
  GuessingGameState,
  ItunesSong,
  LobbyGameState,
  PickingGameState,
  Player,
  Song,
  SongWithNameHidden,
  WS_MessageMapServer,
} from "shared/index.types";
import { playerServerToPlayer } from "~/utils/game/common";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { useCopyToClipboard } from "~/hooks";
import { Icon } from "@iconify-icon/solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import Timer from "~/components/lobby/picking-phase/Timer";
import SongPicker from "~/components/lobby/picking-phase/SongPicker";
import TextBouncy from "~/components/ui/fancy/text-bouncy";
import { Motion } from "solid-motionone";

const dummy_players: Player[] = [
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
  const params = useParams();
  const navigate = useNavigate();
  const copyToClipboard = useCopyToClipboard();

  const ctx = useContext(WsConnectionContext);

  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);
  const [players, setPlayers] = createSignal<Player[]>(dummy_players);
  const [chatMessages, setChatMessages] = createSignal<ChatMessage[]>([]);
  const [thisPlayerIds, setThisPlayerIds] = createSignal<{
    public: string;
    private: string;
  }>();
  const [gameState, setGameState] = createSignal<GameState>({ state: "lobby" });
  // {
  //   state: "guessing",
  //   initialTimeRemaining: 30,
  //   currentInitialTimeRemaining: 30,
  //   playersWhoGuessed: [],
  //   initialDelay: 5,
  // }

  // Temporary game state specific states
  const [didPick, setDidPick] = createSignal<boolean>(false);
  const [currentSongToGuess, setCurrentSongToGuess] = createSignal<SongWithNameHidden>();
  // {
  //   artist: "TheFatRat",
  //   name: [
  //     ["N", "o", "b", null, null, null, null],
  //     ["C", null, null, null, null, null, null],
  //     [null, null],
  //     [null, null, null],
  //     [null, null, null, null, null],
  //   ],
  //   fromPlayerById: "asd",
  //   trackUrl:
  //     "https://music.apple.com/us/album/monody-feat-laura-brehm-radio-edit/1444888726?i=1444888936&uo=4",
  //   imageUrl100x100:
  //     "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/100x100bb.jpg",
  // }

  const lobbyId = () => params.id;

  const getLobbyHost = () => players().find((player) => player.isHost);
  const getThisPlayer = () =>
    players().find((player) => player.publicId === thisPlayerIds()?.public);

  function wsConnect() {
    const context = ctx?.connection;
    if (!context) return;

    if (context.ws) {
      context.log("ws", "Closing previous connection before reconnecting…");
      context.ws.close();
      context.ws = undefined;
      context.clear();
    }

    const pd = profileData();
    if (!pd) return;

    context.log("ws", "Connecting to", context.href, "…");
    const new_ws = new WebSocket(context.href);

    new_ws.addEventListener("message", context.onMessage);
    new_ws.addEventListener("open", () => {
      ctx.setConnection("ws", new_ws);
      context.log("ws", "Connected!");
    });
  }

  async function handleProfileSelected(data: ProfileData) {
    setProfileData(data);
    const newLobbyId = await getLobbyId(lobbyId());
    if (newLobbyId !== lobbyId()) {
      navigate(`/lobby/${newLobbyId}`, { replace: true });
    }

    ctx?.setConnection({
      ws: undefined,
      href: `ws://localhost:5173/ws?lobbyId=${newLobbyId}&name=${data.name}&icon=${data.icon}`,
      lobbyId: newLobbyId,
      onMessage,
      log: () => {},
      clear: () => {},
      send: (data) => ctx.connection.ws?.send(data),
    });

    if (ctx && isWsConnectionContext(ctx?.connection)) {
      wsConnect();
    }
  }

  const onMessage = (event: MessageEvent<string>) => {
    if (!ctx?.connection) return;

    const data = fromMessage<WS_MessageMapServer>(event.data);
    console.log(data);

    switch (data.message.type) {
      // TODO: Possible race conditions when handling new player join
      case "PLAYER_INIT": {
        const payload = data.message.payload;
        const allPlayers = payload.allPlayers.map(playerServerToPlayer);
        setPlayers(allPlayers);
        setThisPlayerIds({
          private: payload.thisPlayerPrivateId,
          public: payload.thisPlayerPublicId,
        });

        ctx.setConnection((old) => {
          return {
            ...old,
            playerId: payload.thisPlayerPrivateId,
          };
        });

        break;
      }
      case "PLAYER_JOIN": {
        const payload = data.message.payload;
        setPlayers((old) => [...old, playerServerToPlayer(payload)]);

        break;
      }

      case "CHANGE_GAME_STATE": {
        const payload = data.message.payload;
        setGameState(payload.properties);

        break;
      }

      case "PLAYER_PICKED_SONG": {
        setPlayers((old) =>
          old.map((player) => ({ ...player, isChecked: player.publicId === data.publicId }))
        );

        if (thisPlayerIds()?.public === data.publicId) {
          setDidPick(true);
        }

        break;
      }

      case "PLAYER_REMOVED_FROM_LOBBY": {
        const payload = data.message.payload;

        setPlayers((old) => old.filter((player) => player.publicId !== payload.publicId));
        break;
      }

      case "NEW_SONG_TO_GUESS": {
        const payload = data.message.payload;

        console.log("NEW SONG TO GUESS", payload.song);
        setCurrentSongToGuess(payload.song);
        break;
      }

      case "IN_BETWEEN_SONGS_DELAY": {
        console.log("SONG DELAY");
        break;
      }

      case "CHAT_MESSAGE_CONFIRM": {
        const payload = data.message.payload;
        setChatMessages((old) => {
          const idx = old.findIndex((message) => message.id === payload.messageId);
          if (idx !== -1) {
            let newArr = old;
            if (payload.isOk) {
              newArr = old.with(idx, {
                ...old[idx],
                isOptimistic: false,
                guessRelation: payload.type,
              });
            } else {
              newArr = old.filter((_, i) => i !== idx);
            }
            return newArr;
          }
          return old;
        });

        break;
      }

      case "CHAT_MESSAGE": {
        const payload = data.message.payload;

        const sender = players().find((player) => player.publicId === data.publicId);
        if (!sender) break;

        setChatMessages((old) => [
          ...old,
          {
            content: payload.content,
            guessRelation: false,
            senderName: sender.name,
          },
        ]);
      }
    }
  };

  const onNextRoundStartButtonClick = () => {
    if (!thisPlayerIds()?.private) return;

    ctx?.connection.ws?.send(
      toPayloadToServer(
        thisPlayerIds()!.private,
        createNewMessageToServer(lobbyId(), "START_GAME", {})
      )
    );
  };

  const handleChatMessage = (content: string) => {
    if (!thisPlayerIds()?.public || !getThisPlayer()) return;

    const newMessage: ChatMessage = {
      id: createUniqueId(),
      content: content,
      guessRelation: false,
      senderName: getThisPlayer()!.name,
      isOptimistic: true,
    };

    // Optimistically update messages
    setChatMessages((old) => [...old, newMessage]);

    ctx?.connection.ws?.send(
      toPayloadToServer(
        thisPlayerIds()!.private,
        createNewMessageToServer(lobbyId(), "CHAT_MESSAGE", {
          messageId: newMessage.id!,
          content,
        })
      )
    );
  };

  const handleSongSelection = (selectedSong: ItunesSong) => {
    if (!thisPlayerIds()?.private) return;

    ctx?.connection.ws?.send(
      toPayloadToServer(
        thisPlayerIds()!.private,
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
        class="relative grid grid-cols-[auto,1fr,auto] gap-4 h-full max-h-full overflow-hidden"
        style={{
          "--custom-height": `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
          height: "var(--custom-height)",
        }}
      >
        <aside
          class={`${styles.aside__scrollbar} relative flex flex-col gap-4 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
          style={{
            height: "var(--custom-height)",
          }}
        >
          <Show when={!!profileData() || true} fallback={<p>Selecting...</p>}>
            {players()
              .toSorted((a, b) => b.points - a.points)
              .map((item, index) => (
                <PlayerDisplay maxPoints={100} player={item} isLeading={!index} />
              ))}
          </Show>
        </aside>
        <Switch>
          <Match when={gameState().state === "lobby"}>
            <section class="grid place-content-center">
              <p class="text-foreground/70">
                Currently <span class="font-bold text-foreground">{players().length}</span> players
                in lobby
              </p>
              <Show
                fallback={
                  <span class="text-lg font-semibold">
                    Waiting for the host to start next round
                  </span>
                }
                when={getLobbyHost()?.publicId === thisPlayerIds()?.public}
              >
                <Button
                  variant={"default"}
                  class="mb-2"
                  disabled={players().length === 0}
                  on:click={onNextRoundStartButtonClick}
                >
                  Start next round
                </Button>
                <div class="flex gap-1 mb-4">
                  <TextFieldRoot class="w-full">
                    <TextField
                      type="text"
                      name="lobbyId"
                      autocomplete="off"
                      readOnly
                      value={lobbyId()}
                      class="text-center uppercase font-bold tracking-wider"
                    />
                  </TextFieldRoot>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        type="button"
                        variant={"outline"}
                        on:click={() => copyToClipboard(window.location.href)}
                      >
                        <Icon
                          icon="solar:copy-bold-duotone"
                          class="text-2xl py-1 text-foreground"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy URL</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </Show>

              <img src="/svgs/waiting.svg" alt="" class="w-80 aspect-[2/3]" />
            </section>
          </Match>
          <Match when={gameState().state === "picking"}>
            <PickingGamePhase
              gameState={gameState() as PickingGameState}
              didPick={didPick()}
              players={players()}
              handleSongSelection={handleSongSelection}
            />
          </Match>
          <Match when={gameState().state === "guessing"}>
            {/* <Show when={!!profileData()} fallback={<p>Selecting...</p>}> */}
            <GuessingGamePhase
              gameState={gameState() as GuessingGameState}
              currentSongToGuess={currentSongToGuess()}
            />
            {/* </Show> */}
          </Match>
        </Switch>
        <aside
          class="h-full max-h-full w-80"
          style={{
            height: "var(--custom-height)",
          }}
        >
          <Show when={!!profileData() || true} fallback={<p>Selecting...</p>}>
            <Chat messages={chatMessages()} onChatMessage={handleChatMessage} />
          </Show>
        </aside>
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
  currentSongToGuess?: SongWithNameHidden;
};

function GuessingGamePhase(props: GuessingGamePhaseProps) {
  const [blurRatio, setBlurRatio] = createSignal<number>(
    props.gameState.currentInitialTimeRemaining / props.gameState.initialTimeRemaining
  );

  function handleTimeChange(current: number) {
    const base = current / props.gameState.initialTimeRemaining;
    const pow = base ** 2;
    setBlurRatio(base + (base - pow));
  }

  return (
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
        fallback={<div class="font-bold text-lg text-foreground">Get ready, starting soon...</div>}
      >
        <section class="flex flex-col items-center">
          <p class="text-xl mb-6 font-bold opacity-35">Guess the song:</p>
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
  );
}
