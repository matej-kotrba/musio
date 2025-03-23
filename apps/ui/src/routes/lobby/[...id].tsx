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
import {
  ChatMessage,
  constructURL,
  createNewMessageToServer,
  getServerURL,
  LOBBY_ID_COOKIE,
  PRIVATE_ID_COOKIE,
  toPayloadToServer,
} from "shared";
import Loader from "~/components/common/loader/Loader";
import { Motion } from "solid-motionone";
import { useCookies } from "~/hooks";
import LobbyChat from "~/features/lobbyChat/LobbyChat";
import WholePageLoaderFallback from "~/components/common/fallbacks/WholePageLoader";

type WsConnectionResourceParams = Maybe<{ lobbyId: string; data: ProfileData }>;

export default function Lobby() {
  const [{ connect, disconnect }, wsActions] = useWebsocket(handleOnWsMessage());
  const [gameStore, { actions }] = useGameStore();
  const { setGameStore } = actions;
  const { get: getCookie, set: setCookie } = useCookies();
  const params = useParams();
  const navigate = useNavigate();

  const [shouldDisplayProfileSelection, setShouldDisplayProfileSelection] = createSignal(false);
  const [wsConnectionResourceParams, setWsConnectionResourceParams] =
    createSignal<WsConnectionResourceParams>(undefined);

  const connectFetchHandler = async (params: WsConnectionResourceParams) => {
    if (!params) return null;
    return connect(params.lobbyId, params.data);
  };

  const [data] = createResource(wsConnectionResourceParams, connectFetchHandler);

  createEffect(() => {
    if (!gameStore.lobbyId || !gameStore.thisPlayerIds?.private) return;
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

  const eventListenerAbortController = new AbortController();

  onMount(async () => {
    if (
      getCookie(LOBBY_ID_COOKIE).value === getLobbyIdFromParams() &&
      getCookie(PRIVATE_ID_COOKIE).value
    ) {
      const { status } = await fetch(constructURL(getServerURL(), "isValidPlayerInLobby"), {
        credentials: "include",
      });

      if (status !== 200) {
        setShouldDisplayProfileSelection(true);
        return;
      }
      handleProfileSelected({ name: "", icon: "seal" });
    } else {
      setShouldDisplayProfileSelection(true);
    }

    window.addEventListener(
      "beforeunload",
      (e) => {
        // TODO:
        // e.preventDefault();
        // e.returnValue = "";
        // const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
        // setCookie(LOBBY_ID_COOKIE, { value: gameStore.lobbyId, expires, path: "/" });
      },
      { signal: eventListenerAbortController.signal }
    );
  });

  onCleanup(() => {
    disconnect();
    eventListenerAbortController.abort();
  });

  return (
    <WsConnectionProvider wsConnection={wsActions}>
      <Show when={shouldDisplayProfileSelection()}>
        <ProfileSelection onProfileSelected={handleProfileSelected} />
      </Show>
      <Suspense fallback={<WholePageLoaderFallback />}>
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
              <div>
                <Switch>
                  <Match when={gameStore.gameState?.state === "lobby"}>
                    <LobbyPhase />
                  </Match>
                  <Match when={gameStore.gameState?.state === "picking"}>
                    <PickingPhase />
                  </Match>
                  <Match when={gameStore.gameState?.state === "guessing"}>
                    <GuessingGamePhase />
                  </Match>
                  <Match when={gameStore.gameState?.state === "leaderboard"}>
                    <LeaderboardsGamePhase />
                  </Match>
                </Switch>
              </div>
              <LobbyChat />
            </div>
          </div>
        </Show>
      </Suspense>
    </WsConnectionProvider>
  );
}
