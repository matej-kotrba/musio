import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import {
  changeLobbyState,
  changeToGuessingGameLobbyState,
  getInitialPickingGameState,
  isLobbyState,
  type LobbiesMap,
  type Lobby,
} from "./lib/lobby.js";
import { getRandomId, isDev, normalizeString } from "./lib/utils.js";
import { LobbyMap } from "./lib/map.js";
import {
  playerNameValidator,
  playerIconNameValidator,
  createNewMessageToClient,
  type WS_MessageMapClient,
  toPayloadToClient,
  messageLengthSchema,
  fromMessageOnServer,
} from "shared";
import { getReceivedPoints, isHost } from "./lib/game.js";
import { createNewLobby, createNewPlayer, createNewSong } from "./lib/create.js";
import { setTimeout } from "timers/promises";
import { getPlayerByPrivateId, removePlayerFromLobby, type PlayerServer } from "./lib/player.js";
import { stringSimilarity } from "string-similarity-js";
import { EventHandleService } from "./lib/events.js";

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const lobbies: LobbiesMap = new LobbyMap<string, Lobby>();

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

app.get("/calculatePoints", (c) => {
  if (isDev()) return c.notFound();

  return c.json(getReceivedPoints(0, 1737400500295, 1737400499241, 10000));
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

function handleChatMessage(
  player: PlayerServer,
  lobby: Lobby,
  { messageId, content }: { messageId: string; content: string }
) {
  player.ws.send(
    toPayloadToClient(
      lobby.id,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
        isOk: true,
        messageId,
        type: false,
      })
    )
  );

  lobbies.publish(
    lobby.id,
    player.privateId,
    toPayloadToClient(
      player.publicId,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE", {
        content: content,
      })
    )
  );
}

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    const eventsHandleService = new EventHandleService();

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
        // if (lobby) {
        //   lobby.stateProperties = getInitialPickingGameState();
        // }

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
        eventsHandleService.reset();

        let parsed: ReturnType<typeof fromMessageOnServer>;

        try {
          if (typeof event.data === "string") {
            parsed = fromMessageOnServer(event.data);
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
            if (
              eventsHandleService.isMessageType(
                lobby.stateProperties.state,
                parsed.message,
                "START_GAME"
              )
            ) {
              if (!isHost(parsed.privateId, lobby)) return;
              const initialData = getInitialPickingGameState();
              changeLobbyState(lobby, initialData);

              // After set time, cancel picking phase and swap to guessing phase
              lobby.data.currentTimeoutAbortController = new AbortController();

              setTimeout(initialData.gameState.initialTimeRemainingInSec * 1000, null, {
                signal: lobby.data.currentTimeoutAbortController.signal,
              })
                .then(() => changeToGuessingGameLobbyState(lobbies, lobby))
                .catch((e) => {});

              lobbies.broadcast(
                lobby.id,
                toPayloadToClient(
                  "server",
                  createNewMessageToClient(lobby.id, "CHANGE_GAME_STATE", {
                    properties: lobby.stateProperties,
                  })
                )
              );
            }
          } else if (isLobbyState(lobby.stateProperties, "picking")) {
            if (
              eventsHandleService.isMessageType(
                lobby.stateProperties.state,
                parsed.message,
                "PICK_SONG"
              )
            ) {
              const player = getPlayerByPrivateId(lobby, parsed.privateId);

              if (!player) return;
              if (lobby.stateProperties.playersWhoPickedIds.includes(parsed.privateId)) return;

              const { name, artist, trackUrl, imageUrl100x100 } = parsed.message.payload;

              const newSong = createNewSong(
                normalizeString(name),
                artist,
                trackUrl,
                imageUrl100x100,
                player.publicId
              );
              lobby.data.pickedSongs.push(newSong);

              if (lobby.data.pickedSongs.length === lobby.players.length) {
                changeToGuessingGameLobbyState(lobbies, lobby);
              } else {
                lobbies.broadcast(
                  lobby.id,
                  toPayloadToClient(
                    player.publicId,
                    createNewMessageToClient(lobby.id, "PLAYER_PICKED_SONG", {})
                  )
                );
              }
            }
          } else if (isLobbyState(lobby.stateProperties, "guessing")) {
            if (
              !lobby.stateProperties.isGuessingPaused &&
              eventsHandleService.isMessageType("all", parsed.message, "CHAT_MESSAGE")
            ) {
              const STRING_SIMILARITY_THRESHOLD = 0.7;

              const { content, messageId } = parsed.message.payload;
              if (messageLengthSchema.safeParse(content).success === false) return;

              const player = getPlayerByPrivateId(lobby, parsed.privateId);
              if (!player) return;

              const currentSong = lobby.data.songQueue[lobby.data.currentSongIndex];
              if (currentSong.fromPlayerByPublicId === player.publicId) return;

              if (currentSong.fromPlayerByPublicId)
                if (normalizeString(content) === currentSong.name) {
                  const receivedPoints = getReceivedPoints(
                    lobby.stateProperties.playersWhoGuessed.length,
                    Date.now(),
                    lobby.stateProperties.startTime,
                    lobby.stateProperties.initialTimeRemaining * 1000
                  );

                  lobbies.broadcast(
                    lobby.id,
                    toPayloadToClient(
                      player.publicId,
                      createNewMessageToClient(lobby.id, "CHANGE_POINTS", {
                        newPoints: receivedPoints,
                      })
                    )
                  );

                  lobby.stateProperties.playersWhoGuessed.push({
                    privateId: player.privateId,
                    points: receivedPoints,
                  });

                  player.ws.send(
                    toPayloadToClient(
                      "server",
                      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
                        isOk: true,
                        type: "guessed",
                        messageId,
                      })
                    )
                  );

                  if (lobby.stateProperties.playersWhoGuessed.length === lobby.players.length) {
                    lobby.data.currentTimeoutAbortController?.abort();
                  }
                } else if (
                  stringSimilarity(content, currentSong.name) >= STRING_SIMILARITY_THRESHOLD
                ) {
                  player.ws.send(
                    toPayloadToClient(
                      "server",
                      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
                        isOk: true,
                        type: "near",
                        messageId,
                      })
                    )
                  );
                } else handleChatMessage(player, lobby, { messageId, content });
            }
          }

          if (
            !eventsHandleService.getTriggeredMessageEventType() &&
            eventsHandleService.isMessageType("all", parsed.message, "CHAT_MESSAGE")
          ) {
            const player = getPlayerByPrivateId(lobby, parsed.privateId);
            if (!player) return;

            const { content, messageId } = parsed.message.payload;
            handleChatMessage(player, lobby, { messageId, content });
          }
        } catch {}
      },
      onClose: (event, ws) => {
        const lobbyId = c.req.query("lobbyId");
        const lobby = lobbies.get(lobbyId!);
        if (!lobby) return;

        const removedPlayer = removePlayerFromLobby(lobby, ws);
        lobbies.broadcast(
          lobbyId!,
          toPayloadToClient(
            "server",
            createNewMessageToClient(lobbyId!, "PLAYER_REMOVED_FROM_LOBBY", {
              publicId: removedPlayer!.publicId,
            })
          )
        );
      },
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
