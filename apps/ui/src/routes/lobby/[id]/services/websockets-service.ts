import { createSignal } from "solid-js";
import { ProfileData } from "~/components/game/profile/ProfileSelection";

export default function useWebsocket(onMessageHandler: (event: MessageEvent<string>) => void) {
  const [ws, setWs] = createSignal<Maybe<WebSocket>>(undefined);

  async function connect(lobbyId: string, data: ProfileData) {
    const newWs = new WebSocket(`ws://${window.location.host}/ws`);

    return new Promise((res) => {
      newWs.addEventListener("open", () => {
        console.log("aoisdaioshduioahsd");
        setWs(newWs);
        res("done");
      });

      // Add listeners for all events
      newWs.onopen = (event) => {
        console.log("WebSocket connection opened:", event);
      };

      newWs.onerror = (event) => {
        console.error("WebSocket error:", event);
      };

      newWs.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
      };

      // Check the readyState
      console.log("Initial WebSocket state:", newWs.readyState);
      // 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED

      // Set a timeout to check the state after a moment
      setTimeout(() => {
        console.log("WebSocket state after timeout:", newWs.readyState);
      }, 2000);

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
