import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import {
  createNewLobby,
  createNewPlayer,
  getLobbyIdFromPeer,
  initPlayerToLobby,
  type Lobby,
} from "./game/lobby.js";
import {
  createNewMessageToClient,
  type WS_MESSAGE_TO_SERVER_TYPE,
  type WS_MessageInterface,
  type WS_MessageMapServer,
} from "shared";
import { toPayload, userIdFromId } from "./game/utils.js";

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const lobbies = new Map<string, Lobby>();

app.get("/", (c) => {
  return c.json("Hello Hono!");
});

app.get("/getLobbyId", (c) => {
  return c.json("123");
});

const CHANNEL_NAME = "chat";
const SERVER_ID = "server";

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen: (event, ws) => {
        const raw = ws.raw;
        console.log(JSON.stringify(raw));
      },
      //   console.log("[ws] open", peer);

      //   const lobbyId = getLobbyIdFromPeer(peer);
      //   if (!lobbyId) {
      //     console.log("No lobby id found in query params");
      //     return;
      //   }

      //   console.log("ID: ", peer.id);
      //   // const playerId = userIdFromId(peer.id);
      //   // peer.send(toPayload(SERVER_ID, `Welcome ${playerId}`));

      //   let lobby = lobbies.get(lobbyId);
      //   let needToRedirect = false;
      //   if (!lobby) {
      //     lobby = createNewLobby(lobbies);
      //     needToRedirect = true;
      //   }

      //   peer.subscribe(lobbyId);

      //   if (needToRedirect) {
      //     console.log("Redirecting to lobby", lobby.id);
      //     peer.send(
      //       toPayload(
      //         SERVER_ID,
      //         createNewMessageToClient(lobby.id, "REDIRECT_TO_LOBBY", {
      //           lobbyId: lobby.id,
      //         })
      //       )
      //     );
      //   }
      // },
      // onMessage(event, ws) {
      //   ws.
      //   const playerId = userIdFromId(peer.id);

      //   let parsedMessage: WS_MessageInterface<WS_MessageMapServer>[WS_MESSAGE_TO_SERVER_TYPE];
      //   try {
      //     parsedMessage = JSON.parse(message.text());
      //   } catch {
      //     console.log("Invalid message format");
      //     return;
      //   }

      //   console.log("[ws] message", playerId, parsedMessage);
      //   switch (parsedMessage.type) {
      //     case "PLAYER_INIT": {
      //       const { name, icon } = parsedMessage.payload;
      //       const newPlayer = initPlayerToLobby(
      //         lobbies,
      //         parsedMessage.lobbyId,
      //         createNewPlayer(playerId, name, icon)
      //       );
      //       if (!newPlayer) return;

      //       // peer.broadcast()
      //       peer.send(
      //         toPayload(
      //           SERVER_ID,
      //           createNewMessageToClient(parsedMessage.lobbyId, "PLAYER_INIT", {
      //             name,
      //             icon,
      //             points: newPlayer.points,
      //           })
      //         )
      //       );
      //       peer.publish(
      //         parsedMessage.lobbyId,
      //         toPayload(
      //           SERVER_ID,
      //           createNewMessageToClient(parsedMessage.lobbyId, "PLAYER_INIT", {
      //             name,
      //             icon,
      //             points: newPlayer.points,
      //           })
      //         )
      //       );

      //       break;
      //     }
      //   }
      // },
      // onClose: () => {
      //   const user = userIdFromId(peer.id);
      //   console.log("[ws] close", user, details);

      //   peer.unsubscribe(CHANNEL_NAME);
      //   // peer.publish(
      //   //   CHANNEL_NAME
      //   //   toPayload(SERVER_ID, `${user} has left the chat!`)
      //   // );
      // },
    };
  })
);

const port = 5173;
console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});
injectWebSocket(server);
