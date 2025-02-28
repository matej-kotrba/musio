import {
  createSignal,
  Show,
  Switch,
  Match,
  onCleanup,
  createUniqueId,
  createEffect,
  createResource,
  onMount,
} from "solid-js";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import { useParams, useNavigate } from "@solidjs/router";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import useWebsocket from "./services/websockets-service";
import { useGameStore } from "./stores/game-store";
import { getAllIcons, PlayerToDisplay } from "~/components/game/Player";
import ProfileSelection, { ProfileData } from "~/components/game/profile/ProfileSelection";
import PlayerList from "~/components/game/phases/shared/player-list/PlayerList";
import { handleOnWsMessage } from "./services/on-message-handler";
import { WsConnectionProvider } from "~/contexts/wsConnection";
import PickingPhase from "~/components/game/phases/picking/components/PickingPhase";
import GuessingGamePhase from "~/components/game/phases/guessing/components/GuessingPhase";
import LobbyPhase from "~/components/game/phases/lobby/components/LobbyPhase";
import LeaderboardsGamePhase from "~/components/game/phases/leaderboards/components/LeaderboardsPhase";
import Chat from "~/components/game/chat/Chat";
import { ChatMessage, createNewMessageToServer, toPayloadToServer } from "shared";
import Loader from "~/components/common/loader/Loader";
import { Motion } from "solid-motionone";
import { useCookies } from "~/hooks";
import { isServer } from "solid-js/web";

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

type WsConnectionResourceParams = Maybe<{ lobbyId: string; data: ProfileData }>;

export default function Lobby() {
  const [{ connect, disconnect }, wsActions] = useWebsocket(handleOnWsMessage());
  const [gameStore, { actions, queries }] = useGameStore();
  const { getThisPlayer } = queries;
  const { setGameStore } = actions;
  const { get: getCookie, set: setCookie } = useCookies();
  const params = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);
  const [wsConnectionResourceParams, setWsConnectionResourceParams] =
    createSignal<WsConnectionResourceParams>(undefined);

  const connectFetchHandler = async (params: WsConnectionResourceParams) => {
    if (!params) return null;
    return connect(params.lobbyId, params.data);
  };

  const [data] = createResource(wsConnectionResourceParams, connectFetchHandler);

  createEffect(() => {
    if (!gameStore.lobbyId) return;
    // On connection update cookie for lobbyId so it can be reused when reloading page...
    setCookie("lobbyId", { value: gameStore.lobbyId, path: "/" });
  });

  const getLobbyIdFromParams = () => params.id;
  const isSongToGuessFromThisPlayer = () =>
    gameStore.currentSongToGuess?.fromPlayerByPublicId === gameStore.thisPlayerIds?.public;

  async function handleProfileSelected(data: ProfileData) {
    setProfileData(data);
    const newLobbyId = await getLobbyId(getLobbyIdFromParams());
    if (newLobbyId !== getLobbyIdFromParams()) {
      navigate(`/lobby/${newLobbyId}`, { replace: true });
    }

    setGameStore("lobbyId", newLobbyId);
    setWsConnectionResourceParams({ data, lobbyId: newLobbyId });
  }

  const handleChatMessage = (content: string) => {
    if (!gameStore.thisPlayerIds?.public || !getThisPlayer()) return;

    const newMessage: ChatMessage = {
      id: createUniqueId(),
      content: content,
      guessRelation: false,
      senderName: getThisPlayer()!.name,
      isOptimistic: true,
    };

    // Optimistically update messages
    setGameStore("chatMessages", gameStore.chatMessages.length, newMessage);

    wsActions.send?.(
      toPayloadToServer(
        gameStore.thisPlayerIds.private,
        createNewMessageToServer(gameStore.lobbyId, "CHAT_MESSAGE", {
          messageId: newMessage.id!,
          content,
        })
      )
    );
  };

  onMount(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";

      const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
      setCookie("lobbyId", { value: gameStore.lobbyId, expires, path: "/" });
    });
  });

  onCleanup(() => disconnect());

  return (
    <WsConnectionProvider wsConnection={wsActions}>
      <ProfileSelection onProfileSelected={handleProfileSelected} />
      <Show
        when={data.state === "ready"}
        fallback={<ConnectingFallback shouldDisplayLoader={!!profileData()} />}
      >
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
            <Switch>
              <Match when={gameStore.gameState.state === "lobby"}>
                <LobbyPhase />
              </Match>
              <Match when={gameStore.gameState.state === "picking"}>
                <PickingPhase />
              </Match>
              <Match when={gameStore.gameState.state === "guessing"}>
                <GuessingGamePhase />
              </Match>
              <Match when={gameStore.gameState.state === "leaderboard"}>
                <LeaderboardsGamePhase />
              </Match>
            </Switch>
            <aside
              class="h-full max-h-full w-80"
              style={{
                height: "var(--custom-height)",
              }}
            >
              <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
                <Chat
                  messages={gameStore.chatMessages}
                  onChatMessage={handleChatMessage}
                  disabled={isSongToGuessFromThisPlayer()}
                />
              </Show>
            </aside>
          </div>
        </div>
      </Show>
    </WsConnectionProvider>
  );
}

type ConnectingFallbackProps = {
  shouldDisplayLoader: boolean;
};

function ConnectingFallback(props: ConnectingFallbackProps) {
  return (
    <Show when={props.shouldDisplayLoader}>
      <Motion.div
        class="fixed inset-0 grid place-content-center bg-black/40 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader />
      </Motion.div>
    </Show>
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
