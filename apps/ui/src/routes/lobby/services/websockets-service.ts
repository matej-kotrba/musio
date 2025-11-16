import { createSignal } from "solid-js";
import { ProfileData } from "~/components/game/profile/ProfileSelection";
import { getServerURLOrRedirectClient } from "~/utils/urls";
import { StatusCode, StatusCodes } from "shared";
import { useNavigate } from "@solidjs/router";
import { ReconnectStrategy } from "./ws-reconnect-strategy";

export default function useWebsocket(onMessageHandler: (event: MessageEvent<string>) => void) {
  const [ws, setWs] = createSignal<Maybe<WebSocket>>(undefined);
  const navigate = useNavigate();

  async function connect(lobbyId: string, data: ProfileData) {
    let serverAddress = getServerURLOrRedirectClient();
    serverAddress = serverAddress.replace("https://", "").replace("http://", "");
    const wsProtocol = import.meta.env.VITE_ENVIRONMENT === "development" ? "ws" : "wss";
    const wsReconnectionStrategy = new ReconnectStrategy(
      {
        wsProtocol,
        serverAddress,
        lobbyId,
        player: data,
      },
      5
    );
    return wsReconnectionStrategy.startWsConnectionAsync(
      (newWs) => {
        setWs(newWs);
      },
      onMessageHandler,
      onWsConnectionClose,
      () => {
        console.error("DEFECT");
      }
    );
  }

  function onWsConnectionClose(e: CloseEvent, retry: () => Promise<unknown>) {
    const reason = e.reason as StatusCodes;
    console.log("Connection was closed", reason);

    // Only do the redirect when the reason is known
    if (Object.values(StatusCode).includes(reason)) {
      navigate(`/?error=${getConnectionCloseErrorBasedOnReason(reason as StatusCodes)}`, {
        replace: true,
      });
    } else {
      retry();
    }
  }

  function disconnect() {
    ws()?.close();
  }

  function getConnectionCloseErrorBasedOnReason(reason: StatusCodes) {
    if (!(reason in StatusCode)) return;

    if (reason === "LOBBY_FULL") {
      return "Lobby is already full 😭";
    }

    if (reason === "INVALID_USER_PROFILE") {
      return "Player data are not correct";
    }

    if (reason === "RECONNECTED_PLAYER_NO_LONGER_IN_LOBBY") {
      return "Sorry, but you are not part of a lobby anymore";
    }
  }

  return [
    {
      connect,
      disconnect,
    },
    {
      get send() {
        return ws()?.send.bind(ws());
      },
    },
  ] as const;
  // const wsConnection: Maybe<WsConnection> = {
  //   ws: undefined,
  //   href: `ws://localhost:5173/ws?lobbyId=${newLobbyId}&name=${data.name}&icon=${data.icon}`,
  //   lobbyId: newLobbyId,
  //   onMessage,
  //   log: () => {},
  //   clear: () => {},
  //   send: (data) => ctx.connection.ws?.send(data),
  // };

  // function wsConnect() {
  //   const context = ctx?.connection;
  //   if (!context) return;

  //   if (context.ws) {
  //     context.log("ws", "Closing previous connection before reconnecting…");
  //     context.ws.close();
  //     context.ws = undefined;
  //     context.clear();
  //   }

  //   const pd = profileData();
  //   if (!pd) return;

  //   context.log("ws", "Connecting to", context.href, "…");
  //   const new_ws = new WebSocket(context.href);

  //   new_ws.addEventListener("message", context.onMessage);
  //   new_ws.addEventListener("open", () => {
  //     ctx.setConnection("ws", new_ws);
  //     context.log("ws", "Connected!");
  //   });
  // }
}
