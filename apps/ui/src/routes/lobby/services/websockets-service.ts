import { getServerURL } from "shared";
import { createSignal } from "solid-js";
import { ProfileData } from "~/components/game/profile/ProfileSelection";

export default function useWebsocket(onMessageHandler: (event: MessageEvent<string>) => void) {
  const [ws, setWs] = createSignal<Maybe<WebSocket>>(undefined);

  async function connect(lobbyId: string, data: ProfileData) {
    let serverAddress = getServerURL(import.meta.env.VITE_ENVIRONMENT);
    serverAddress = serverAddress.replace("https://", "").replace("http://", "");
    const wsProtocol = import.meta.env.VITE_ENVIRONMENT === "development" ? "ws" : "wss";
    const newWs = new WebSocket(
      `${wsProtocol}://${serverAddress}/ws?lobbyId=${lobbyId}&name=${data.name}&icon=${data.icon}`
    );
    return new Promise((res) => {
      newWs.addEventListener("open", () => {
        setWs(newWs);
        res("done");
      });

      newWs.onmessage = onMessageHandler;
    });
  }

  function disconnect() {
    ws()?.close();
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
