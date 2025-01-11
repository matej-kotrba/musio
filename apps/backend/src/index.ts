import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import {
  changeLobbyState,
  getInitialGuessingGameState,
  getInitialPickingGameState,
  getPlayerByPrivateId,
  isLobbyState,
  isMessageType,
  type LobbiesMap,
  type Lobby,
} from "./lib/lobby.js";
import { getRandomId, isDev } from "./lib/utils.js";
import { LobbyMap } from "./lib/map.js";
import {
  playerNameValidator,
  playerIconNameValidator,
  createNewMessageToClient,
  type WS_MessageMapClient,
  toPayloadToClient,
  fromMessage,
} from "shared";
import { isHost } from "./lib/game.js";
import { createNewLobby, createNewPlayer, createNewSong } from "./lib/create.js";

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

app.get("/getLobby", (c) => {
  if (isDev()) return c.notFound();

  return c.json(lobbies.get(c.req.query("lobbyId")!));
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

        const newPlayer = createNewPlayer(ws, getRandomId(), getRandomId(), name!, icon!);
        if (lobby?.players.length === 0) {
          lobby.leaderPlayerId = newPlayer.privateId;
        }
        lobby!.players.push(newPlayer);

        //TODO: REMOVE THIS LINE
        if (lobby) {
          lobby.stateProperties = getInitialPickingGameState();
        }

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
          newPlayer.privateId,
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
          // if (!isMessageTypeValidForGameState(lobby.stateProperties.state, parsed.message.type)) {
          //   throw new Error("Invalid message type for current game state");
          // }

          if (isLobbyState(lobby.stateProperties, "lobby")) {
            lobby.stateProperties.state;
            if (isMessageType(lobby.stateProperties.state, parsed.message, "START_GAME")) {
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
            }
          } else if (isLobbyState(lobby.stateProperties, "picking")) {
            console.log("Picking state", parsed.message);
            if (isMessageType(lobby.stateProperties.state, parsed.message, "PICK_SONG")) {
              const player = getPlayerByPrivateId(lobby, parsed.userId);

              if (!player) return;
              if (lobby.stateProperties.playersWhoPickedIds.includes(parsed.userId)) return;

              const { name, artist, trackUrl } = parsed.message.payload;

              const newSong = createNewSong(name, artist, trackUrl, parsed.userId);
              lobby.data.pickedSongs.push(newSong);

              console.log("Picked songs: ", lobby.data.pickedSongs);

              // if (lobby.data.pickedSongs.length === lobby.players.length) {
              //   changeLobbyState(lobby, getInitialGuessingGameState(lobby.data.pickedSongs));
              // } else {
              lobbies.broadcast(
                lobby.id,
                toPayloadToClient(
                  player.publicId,
                  createNewMessageToClient(lobby.id, "PLAYER_PICKED_SONG", {})
                )
              );
              // }
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
