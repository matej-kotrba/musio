import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import {
  createNewLobby,
  createNewPlayer,
  type LobbiesMap,
  type Lobby,
} from "./game/lobby.js";
import { getRandomId, isDev } from "./game/utils.js";
import { LobbyMap } from "./game/map.js";
import { playerNameValidator, playerIconNameValidator } from "shared";

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const lobbies: LobbiesMap = new LobbyMap<string, Lobby>();

app.get("/", (c) => {
  return c.json("Hello Hono!");
});

// Dev only endpoints
// ****
app.get("/getLobbies", (c) => {
  if (isDev()) return c.notFound();

  return c.json([...lobbies.keys()]);
});

app.get("/purgeLobbies", (c) => {
  if (isDev()) return c.notFound();

  lobbies.clear();
  return c.json("Lobbies purged");
});
// ****

app.get("/getLobbyId", (c) => {
  const lobbyId = c.req.query("lobbyId");

  if (!lobbyId || !lobbies.has(lobbyId)) {
    const newLobby = createNewLobby(lobbies);

    return c.json(newLobby.id);
  }

  return c.json(lobbies.get(lobbyId)!.id);
});

const CHANNEL_NAME = "chat";
const SERVER_ID = "server";

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen: (event, ws) => {
        const lobbyId = c.req.query("lobbyId");
        const name = c.req.query("name");
        const icon = c.req.query("icon");

        if (
          !playerNameValidator.safeParse(name).success ||
          !playerIconNameValidator.safeParse(icon).success
        ) {
          console.log("Invalid name or icon provided");
          ws.close();
          return;
        }

        if (!lobbyId || !lobbies.has(lobbyId)) {
          console.log("Not sufficent lobbyId provided");
          ws.close();
          return;
        }

        console.log("[ws] open");

        ws.send(`${SERVER_ID} Welcome!`);

        let lobby = lobbies.get(lobbyId);
        lobby?.players.push(createNewPlayer(ws, getRandomId(), name!, icon!));

        lobbies.publish(
          lobbyId,
          "Sender",
          `${SERVER_ID} ${name} has joined the chat!`
        );
      },
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
