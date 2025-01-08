import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import {
  changeLobbyState,
  createNewLobby,
  createNewPlayer,
  getInitialPickingGameState,
  type LobbiesMap,
  type Lobby,
} from "./lib/lobby.js";
import { getRandomId, isDev } from "./lib/utils.js";
import { LobbyMap } from "./lib/map.js";
import {
  playerNameValidator,
  playerIconNameValidator,
  createNewMessageToClient,
  type PlayerFromServer,
  type WS_MessageMapClient,
  toPayloadToClient,
  fromMessage,
  messageToClientGameState,
} from "shared";
import {
  isHost,
  isMessageTypeForGameState as isMessageTypeValidForGameState,
} from "./lib/game.js";
import { SONG_PICKING_DURATION } from "./lib/constants.js";

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

        const newPlayer = createNewPlayer(
          ws,
          getRandomId(),
          getRandomId(),
          name!,
          icon!
        );
        if (lobby?.players.length === 0) {
          lobby.leaderPlayerId = newPlayer.privateId;
        }
        lobby!.players.push(newPlayer);

        console.log("[ws] open - ", newPlayer.name);
        ws.send(
          toPayloadToClient(
            "server",
            createNewMessageToClient(lobby!.id, "PLAYER_INIT", {
              allPlayers: lobby!.players.map((player) => ({
                publicId: player.publicId,
                name: player.name,
                icon: player.icon,
                points: player.points,
                isHost: isHost(player.privateId, lobby!),
              })),
              thisPlayerPrivateId: newPlayer.privateId,
              thisPlayerPublicId: newPlayer.publicId,
            })
          )
        );

        lobbies.publish(
          lobbyId,
          newPlayer.publicId,
          toPayloadToClient(
            "server",
            createNewMessageToClient(lobby!.id, "PLAYER_JOIN", {
              publicId: newPlayer.publicId,
              name: newPlayer.name,
              icon: newPlayer.icon,
              points: newPlayer.points,
              isHost: isHost(newPlayer.privateId, lobby!),
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

          const lobby = lobbies.get(parsed.message.lobbyId);

          if (!lobby) throw new Error("Invalid lobbyId");

          // If the event is not compatible with the current game state, ignore it
          if (
            !isMessageTypeValidForGameState(
              lobby.stateProperties.state,
              parsed.message.type
            )
          ) {
            throw new Error("Invalid message type for current game state");
          }

          switch (lobby.stateProperties.state) {
            case "lobby": {
              switch (
                parsed.message
                  .type as (typeof messageToClientGameState)["lobby"][number]
              ) {
                case "START_GAME": {
                  if (!isHost(parsed.userId, lobby)) return;
                  changeLobbyState(lobby, getInitialPickingGameState());

                  lobbies.publish(
                    lobby.id,
                    "server",
                    toPayloadToClient(
                      "server",
                      createNewMessageToClient(lobby.id, "CHANGE_GAME_STATE", {
                        properties: lobby.stateProperties,
                      })
                    )
                  );

                  break;
                }

                default:
                  break;
              }

              break;
            }

            case "picking": {
              switch (
                parsed.message
                  .type as (typeof messageToClientGameState)["picking"][number]
              ) {
                case "PICK_SONG": {
                  // const { artist, name, trackUrl } = parsed.message.payload;
                  // lobby.stateProperties.;

                  break;
                }

                default:
                  break;
              }

              break;
            }
          }
        } catch {}
      },
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
