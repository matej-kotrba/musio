import styles from "./index.module.css";
import {
  createSignal,
  Show,
  useContext,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import PlayerDisplay, { getAllIcons } from "~/components/lobby/Player";
import WordToGuess from "~/components/lobby/WordToGuess";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import Chat from "~/components/lobby/chat/Chat";
import {
  isWsConnectionContext,
  WsConnectionContext,
} from "~/contexts/connection";
import { useParams, useNavigate } from "@solidjs/router";
import ProfileSelection, {
  ProfileData,
} from "~/components/lobby/profile/ProfileSelection";
import {
  createNewMessageToServer,
  fromMessage,
  toPayloadToServer,
} from "shared";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import {
  GameState,
  ItunesSong,
  LobbyGameState,
  PickingGameState,
  Player,
  WS_MessageMapServer,
} from "shared/index.types";
import { playerServerToPlayer } from "~/utils/game/common";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { useCopyToClipboard } from "~/hooks";
import { Icon } from "@iconify-icon/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Timer from "~/components/lobby/picking-phase/Timer";
import SongPicker from "~/components/lobby/picking-phase/SongPicker";

const dummy_players: Player[] = [
  {
    name: "Very Long cool name asd asd asd awsdasd",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 100,
    isHost: true,
    isMe: true,
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 89,
    isHost: false,
    isMe: false,
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 76,
    isHost: false,
    isMe: false,
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 67,
    isHost: false,
    isMe: false,
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 56,
    isHost: false,
    isMe: false,
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 43,
    isHost: false,
    isMe: false,
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 39,
    isHost: false,
    isMe: false,
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 28,
    isHost: false,
    isMe: false,
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 13,
    isHost: false,
    isMe: false,
  },
];

const dummySongName = [
  "R",
  null,
  null,
  null,
  " ",
  null,
  null,
  "t",
  null,
  null,
  "m",
];

const dummySongImage = "/2000x2000bb.jpg";

export default function Lobby() {
  const params = useParams();
  const navigate = useNavigate();
  const copyToClipboard = useCopyToClipboard();

  const ctx = useContext(WsConnectionContext);

  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);
  const [players, setPlayers] = createSignal<Player[]>(dummy_players);
  const [thisPlayerId, setThisPlayerId] = createSignal<string>("");
  const [gameState, setGameState] = createSignal<GameState>({
    state: "picking",
    initialTimeRemaining: 30,
    playersWhoPickedIds: [],
  });
  const lobbyId = () => params.id;

  const getLobbyHost = () => players().find((player) => player.isHost);
  const getThisPlayer = () => players().find((player) => player.isMe);

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
        setThisPlayerId(payload.thisPlayerId);

        ctx.setConnection((old) => {
          return {
            ...old,
            playerId: payload.thisPlayerId,
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
    }
  };

  const onNextRoundStartButtonClick = () =>
    ctx?.connection.ws?.send(
      toPayloadToServer(
        thisPlayerId(),
        createNewMessageToServer(lobbyId(), "START_GAME", {})
      )
    );

  const handleSongSelection = (selectedSong: ItunesSong) =>
    ctx?.connection.ws?.send(
      toPayloadToServer(
        thisPlayerId(),
        createNewMessageToServer(lobbyId(), "PICK_SONG", {
          name: selectedSong.trackName,
          artist: selectedSong.artistName,
          trackUrl: selectedSong.trackViewUrl,
        })
      )
    );

  return (
    <>
      {/* <ProfileSelection onProfileSelected={handleProfileSelected} /> */}
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
                <PlayerDisplay
                  maxPoints={100}
                  player={item}
                  isLeading={!index}
                />
              ))}
          </Show>
        </aside>
        <Switch>
          <Match when={gameState().state === "lobby"}>
            <section class="grid place-content-center">
              <p class="text-foreground/70">
                Currently{" "}
                <span class="font-bold text-foreground">
                  {players().length}
                </span>{" "}
                players in lobby
              </p>
              <Show
                fallback={
                  <span class="text-lg font-semibold">
                    Waiting for the host to start next round
                  </span>
                }
                when={getLobbyHost()?.isMe}
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
            <div class="flex flex-col items-center">
              <Timer
                maxTime={(gameState() as PickingGameState).initialTimeRemaining}
                currentTime={
                  (gameState() as PickingGameState).initialTimeRemaining
                }
              />
              <SongPicker onSongSelect={handleSongSelection} />
            </div>
          </Match>
          <Match when={gameState().state === "guessing"}>
            <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
              <section class="flex flex-col items-center">
                <p class="text-xl mb-4 font-bold opacity-35">Guess the song:</p>
                <div class="mb-4">
                  <div class="w-64 aspect-square overflow-hidden rounded-md">
                    <img
                      src={dummySongImage}
                      alt="Song to guess"
                      class="blur-md"
                    />
                  </div>
                </div>
                <WordToGuess wordChars={dummySongName} />
              </section>
            </Show>
          </Match>
        </Switch>
        <aside
          class="h-full max-h-full w-80"
          style={{
            height: "var(--custom-height)",
          }}
        >
          <Show when={!!profileData() || true} fallback={<p>Selecting...</p>}>
            <Chat />
          </Show>
        </aside>
      </div>
    </>
  );
}
