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
  Suspense,
} from "solid-js";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import { useParams, useNavigate } from "@solidjs/router";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import useWebsocket from "./services/websockets-service";
import { useGameStore } from "./stores/game-store";
import ProfileSelection, { ProfileData } from "~/components/game/profile/ProfileSelection";
import PlayerList from "~/components/game/phases/shared/player-list/PlayerList";
import { handleOnWsMessage } from "./services/on-message-handler";
import { WsConnectionProvider } from "~/contexts/wsConnection";
import PickingPhase from "~/components/game/phases/picking/components/PickingPhase";
import GuessingGamePhase from "~/components/game/phases/guessing/components/GuessingPhase";
import LobbyPhase from "~/components/game/phases/lobby/components/LobbyPhase";
import LeaderboardsGamePhase from "~/components/game/phases/leaderboards/components/LeaderboardsPhase";
import Chat from "~/features/lobbyChat/components/Chat";
import { ChatMessage, createNewMessageToServer, LOBBY_ID_COOKIE, toPayloadToServer } from "shared";
import Loader from "~/components/common/loader/Loader";
import { Motion } from "solid-motionone";
import { useCookies } from "~/hooks";
import LobbyChat from "~/features/lobbyChat/LobbyChat";

type WsConnectionResourceParams = Maybe<{ lobbyId: string; data: ProfileData }>;

export default function Lobby() {
  const [{ connect, disconnect }, wsActions] = useWebsocket(handleOnWsMessage());
  const [gameStore, { actions }] = useGameStore();
  const { setGameStore } = actions;
  const { set: setCookie } = useCookies();
  const params = useParams();
  const navigate = useNavigate();

  const [wsConnectionResourceParams, setWsConnectionResourceParams] =
    createSignal<WsConnectionResourceParams>(undefined);

  const connectFetchHandler = async (params: WsConnectionResourceParams) => {
    if (!params) return null;
    return connect(params.lobbyId, params.data);
  };

  const [data] = createResource(wsConnectionResourceParams, connectFetchHandler);

  createEffect(() => {
    if (!gameStore.lobbyId || !gameStore.thisPlayerIds) return;
    // On connection update cookie for lobbyId so it can be reused when reloading page...
    setCookie(LOBBY_ID_COOKIE, { value: gameStore.lobbyId, path: "/" });
    setCookie("privateId", { value: gameStore.thisPlayerIds?.private, path: "/" });
  });

  const getLobbyIdFromParams = () => params.id;

  async function handleProfileSelected(data: ProfileData) {
    const newLobbyId = await getLobbyId(getLobbyIdFromParams());
    if (newLobbyId !== getLobbyIdFromParams()) {
      navigate(`/lobby/${newLobbyId}`, { replace: true });
    }

    setGameStore("lobbyId", newLobbyId);
    setWsConnectionResourceParams({ data, lobbyId: newLobbyId });
  }

  onMount(() => {
    window.addEventListener("beforeunload", (e) => {
      // e.preventDefault();
      // e.returnValue = "";

      const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
      setCookie(LOBBY_ID_COOKIE, { value: gameStore.lobbyId, expires, path: "/" });
    });
  });

  onCleanup(() => disconnect());

  return (
    <WsConnectionProvider wsConnection={wsActions}>
      <ProfileSelection onProfileSelected={handleProfileSelected} />
      <Suspense fallback={<ConnectingFallback />}>
        <Show when={data()}>
          <div
            class="relative"
            style={{
              "--custom-height": `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
              height: `calc(var(--custom-height) + ${LOBBY_LAYOUT_HEIGHT} * 2)`,
            }}
          >
            <div class="grid grid-cols-[auto,1fr,auto] gap-4 py-4 overflow-hidden">
              {/* Player sidebar */}
              <PlayerList />
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
              <LobbyChat />
            </div>
          </div>
        </Show>
      </Suspense>
    </WsConnectionProvider>
  );
}

function ConnectingFallback() {
  return (
    <Motion.div
      class="fixed inset-0 grid place-content-center bg-black/40 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader />
    </Motion.div>
  );
}
