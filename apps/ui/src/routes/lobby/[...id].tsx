import styles from "./lobby.module.css";
import {
  createSignal,
  Show,
  Switch,
  Match,
  onCleanup,
  createEffect,
  createResource,
  onMount,
  Suspense,
  ErrorBoundary,
  on,
} from "solid-js";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import { useParams, useNavigate, createAsync } from "@solidjs/router";
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
import { constructURL, getServerURL } from "shared";
import { useCookies, useDeferredResource } from "~/hooks";
import LobbyChat from "~/features/lobbyChat/LobbyChat";
import WholePageLoaderFallback from "~/components/common/fallbacks/WholePageLoader";
import { getOptionsForNgrokCrossSite } from "~/utils/fetch";

type WsConnectionResourceParams = { lobbyId: string; data: ProfileData };

export default function Lobby() {
  const [{ connect, disconnect }, wsActions] = useWebsocket(handleOnWsMessage());
  const [gameStore, { actions }] = useGameStore();
  const { setGameStore } = actions;
  const params = useParams();
  const navigate = useNavigate();

  const [shouldDisplayProfileSelection, setShouldDisplayProfileSelection] = createSignal(false);

  const [runConnectFetchResource, wsConnectionIndicator] = useDeferredResource(connectFetchHandler);
  const [runNewLobbyIdResource, lobbyCallResourceData] = useDeferredResource(handleProfileSelected);

  const getLobbyIdFromParams = () => params.id;

  async function connectFetchHandler(params: WsConnectionResourceParams) {
    return connect(params.lobbyId, params.data);
  }

  async function handleProfileSelected(profileData: ProfileData) {
    const lobbyId = await getLobbyId(getLobbyIdFromParams());
    return { lobbyId, profileData };
  }

  async function setCookiesForLobbyAndPrivateId() {
    const res = await fetch(
      constructURL(
        getServerURL(import.meta.env.VITE_ENVIRONMENT),
        `setCookies?lobbyId=${gameStore.lobbyId}&privateId=${gameStore.thisPlayerIds?.private}`
      ),
      getOptionsForNgrokCrossSite()
    );

    return res.status;
  }

  async function onProfileSelected(data: ProfileData) {
    runNewLobbyIdResource(data);
  }

  createEffect(
    on(lobbyCallResourceData, () => {
      const lobbyCallData = lobbyCallResourceData();
      if (!lobbyCallData) return;

      const { lobbyId: newLobbyId, profileData } = lobbyCallData;

      if (newLobbyId !== getLobbyIdFromParams()) {
        navigate(`/lobby/${newLobbyId}`, { replace: true });
      }

      setGameStore("lobbyId", newLobbyId);
      runConnectFetchResource({ data: profileData, lobbyId: newLobbyId });
    })
  );

  createEffect(() => {
    if (!gameStore.lobbyId || !gameStore.thisPlayerIds?.private) return;
    // On connection update cookie for lobbyId so it can be reused when reloading page...
    setCookiesForLobbyAndPrivateId();
  });

  const eventListenerAbortController = new AbortController();

  onMount(async () => {
    const { status } = await fetch(
      constructURL(getServerURL(import.meta.env.VITE_ENVIRONMENT), "isValidPlayerInLobby"),
      getOptionsForNgrokCrossSite()
    );

    if (status !== 200) {
      setShouldDisplayProfileSelection(true);
      return;
    }

    // Reconnect logic, sending incorrect data means that it will fail if the player is not reconnecting
    // as the server checks the privateId sent with the request first
    onProfileSelected({ name: "", icon: "" });
    // } else {
    //   setShouldDisplayProfileSelection(true);
    // }

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
      <Suspense fallback={<WholePageLoaderFallback />}>
        <Show when={shouldDisplayProfileSelection()}>
          <ProfileSelection onProfileSelected={onProfileSelected} />
        </Show>
        <Show when={lobbyCallResourceData() && wsConnectionIndicator()}>
          <div
            class="relative"
            style={{
              "--custom-height": `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
              height: `calc(var(--custom-height) + ${LOBBY_LAYOUT_HEIGHT} * 2)`,
            }}
          >
            <div
              class={`${styles["glassy-bg"]} grid grid-cols-[auto,1fr,auto] gap-4 py-4 overflow-hidden px-3`}
            >
              {/* Player sidebar */}
              <PlayerList players={gameStore.players} />
              {/* ___ */}
              {/* <ErrorBoundary fallback={<LobbyErrorBoundary />}> */}
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
              {/* </ErrorBoundary> */}
              {/* Player sidebar */}
              <LobbyChat />
              {/* ___ */}
            </div>
          </div>
        </Show>
      </Suspense>
    </WsConnectionProvider>
  );
}

function LobbyErrorBoundary() {
  return <div>Something went wrong</div>;
}
