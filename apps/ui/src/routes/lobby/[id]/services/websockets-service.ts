import { ProfileData } from "~/components/game/profile/ProfileSelection";

export type WsConnection = {
  ws: WebSocket | undefined;
  href: string;
  lobbyId: string;
  playerId: string;
  onMessage: (event: MessageEvent<string>) => void;
  log: (user: string, ...args: Array<string>) => void;
  clear: () => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
};

export default function useWebsocket(onMessageHandler: (event: MessageEvent<string>) => void) {
  let ws: Maybe<WebSocket> = undefined;

  async function connect(lobbyId: string, data: ProfileData) {
    ws = new WebSocket(
      `ws://localhost:5173/ws?lobbyId=${lobbyId}&name=${data.name}&icon=${data.icon}`
    );

    return new Promise((res) => {
      ws!.addEventListener("open", res);
      ws!.onmessage = onMessageHandler;
    });
  }

  function disconnect() {
    ws?.close();
  }

  return {
    connect,
    disconnect,
    get send() {
      return ws?.send;
    },
  };
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
