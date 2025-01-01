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
import {
  playerNameValidator,
  playerIconNameValidator,
  createNewMessageToClient,
  type PlayerServerWithoutWS,
  type WS_MessageMapClient,
  toPayloadToClient,
  fromMessage,
} from "shared";

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

        const lobby = lobbies.get(lobbyId);

        const newPlayer = createNewPlayer(ws, getRandomId(), name!, icon!);
        lobby!.players.push(newPlayer);

        console.log("[ws] open - ", newPlayer.name);
        ws.send(
          toPayloadToClient(
            "server",
            createNewMessageToClient(lobby!.id, "PLAYER_INIT", {
              id: newPlayer.id,
              icon: newPlayer.icon,
              name: newPlayer.name,
              points: newPlayer.points,
              allPlayers: lobby!.players.map((player) => ({
                id: player.id,
                name: player.name,
                icon: player.icon,
                points: player.points,
              })),
            })
          )
        );

        lobbies.publish(
          lobbyId,
          newPlayer.id,
          toPayloadToClient(
            "server",
            createNewMessageToClient(lobby!.id, "PLAYER_JOIN", {
              id: newPlayer.id,
              name: newPlayer.name,
              icon: newPlayer.icon,
              points: newPlayer.points,
            })
          )
        );
      },
      onMessage: (event, ws) => {
        console.log("[ws] message");

        let parsed: ReturnType<typeof fromMessage<WS_MessageMapClient>>;
        try {
          if (typeof event.data === "string") {
            parsed = fromMessage<WS_MessageMapClient>(event.data);
          } else {
            throw new Error("Invalid message format");
          }

          switch (parsed.message.type) {
            case "PICK_SONG": {
              console.log("PICK_SONG", parsed.message.payload);
              break;
            }
          }
        } catch {}
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
