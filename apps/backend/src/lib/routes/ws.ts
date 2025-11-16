import {
  playerNameValidator,
  playerIconNameValidator,
  toPayloadToClient,
  createNewMessageToClient,
  fromMessageOnServer,
  type FromMessageOnServerByStateType,
  PRIVATE_ID_COOKIE,
  LOBBY_ID_COOKIE,
  RATELIMIT_MESSAGE_IN_MS,
  StatusCode,
} from "shared";
import { createDateWithFallback, getRandomId, isDev, parseCookie } from "../common/utils";
import { handleAllEvent } from "../events/all";
import { handleGuessingEvent } from "../events/guessing";
import { handleLobbyEvent } from "../events/lobby";
import { handlePickingEvent } from "../events/picking";
import { getLobbiesService, createNewPlayer, createNewLobby } from "../game/create";
import { isLobbyState, type Lobby } from "../game/lobby";
import {
  convertServerPlayerToClientPlayer,
  getPlayerByPrivateId,
  getPlayerByWs,
  removePlayerFromLobby,
  type PlayerServer,
} from "../game/player";
import type { Hono } from "hono";
import type { UpgradeWebSocket } from "hono/ws";
import { handleLeaderboardsEvent } from "../events/leaderboards";

export default function setupWsEndpoints(app: Hono, upgradeWebSocket: UpgradeWebSocket) {
  app.get(
    "/ws",
    upgradeWebSocket(async (c) => {
      return {
        onOpen: async (event, ws) => {
          const cookie = c.req.header().cookie ?? "";
          const [cookiePrivateId, cookieLobbyId] = parseCookie(
            cookie,
            PRIVATE_ID_COOKIE,
            LOBBY_ID_COOKIE
          );

          const lobbyId = c.req.query("lobbyId");
          const name = c.req.query("name");
          const icon = c.req.query("icon");
          const lobbies = getLobbiesService().lobbies;

          console.log("cookies", cookiePrivateId, cookieLobbyId);

          let lobby = lobbies.get(lobbyId!);
          if (!lobby) lobby = createNewLobby(lobbies);

          // If players wants to reconnect he has to have cookieLoobyId
          const isPlayerTryingToReconnect = cookieLobbyId && cookieLobbyId === lobbyId;
          const reconnectedPlayer = isPlayerTryingToReconnect
            ? getPlayerByPrivateId(lobby, cookiePrivateId as string)
            : undefined;

          if (isPlayerTryingToReconnect && !reconnectedPlayer) {
            ws.close(1000, StatusCode.RECONNECTED_PLAYER_NO_LONGER_IN_LOBBY);

            return;
          }

          if (!reconnectedPlayer) {
            if (lobby.players.length >= lobby.options.playerLimit) {
              ws.close(1000, StatusCode.LOBBY_FULL);

              return;
            }

            if (
              !playerNameValidator.safeParse(name).success ||
              !playerIconNameValidator.safeParse(icon).success
            ) {
              console.log("Invalid name or icon provided");
              ws.close(1000, StatusCode.INVALID_USER_PROFILE);

              return;
            }

            const newPlayer = createNewPlayer(ws, getRandomId(), getRandomId(), name!, icon!);

            if (lobby?.players.length === 0) {
              lobby.leaderPrivateId = newPlayer.privateId;
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
                  allPlayers: lobby!.players.map((player) =>
                    convertServerPlayerToClientPlayer(lobby, player)
                  ),
                  thisPlayerPrivateId: newPlayer.privateId,
                  thisPlayerPublicId: newPlayer.publicId,
                  gameOptions: lobby!.options,
                  gameStateData: lobby!.stateProperties,
                })
              )
            );

            lobbies.publish(
              lobby.id,
              newPlayer.privateId,
              toPayloadToClient(
                "server",
                createNewMessageToClient(
                  lobby!.id,
                  "PLAYER_JOIN",
                  convertServerPlayerToClientPlayer(lobby, newPlayer)
                )
              )
            );
          } else {
            reconnectedPlayer.ws = ws;
            reconnectedPlayer.connectionStatus = "connected";

            console.log("[ws] reconnected open - ", reconnectedPlayer.name);
            ws.send(
              toPayloadToClient(
                "server",
                createNewMessageToClient(lobby!.id, "PLAYER_INIT", {
                  allPlayers: lobby!.players.map((player) =>
                    convertServerPlayerToClientPlayer(lobby, player)
                  ),
                  thisPlayerPrivateId: reconnectedPlayer.privateId,
                  thisPlayerPublicId: reconnectedPlayer.publicId,
                  gameOptions: lobby!.options,
                  gameStateData: lobby!.stateProperties,
                })
              )
            );

            lobbies.publish(
              lobbyId!,
              reconnectedPlayer.privateId,
              toPayloadToClient(
                reconnectedPlayer.publicId,
                createNewMessageToClient(lobbyId!, "PLAYER_DATA_CHANGE", {
                  connectionStatus: "connected",
                })
              )
            );
          }
        },
        onMessage: (event, ws) => {
          console.log("[ws] message");

          let parsedData: ReturnType<typeof fromMessageOnServer>;

          try {
            if (typeof event.data === "string") {
              parsedData = fromMessageOnServer(event.data);
            } else {
              throw new Error("Invalid message format");
            }

            const lobby = getLobbiesService().lobbies.get(parsedData.message.lobbyId);
            if (!lobby) throw new Error("Invalid lobbyId");

            const player = getPlayerByPrivateId(lobby, parsedData.privateId);
            if (!player) throw new Error("Invalid player");

            // Ideally refactor that someday so it doesn't have to be here
            if (parsedData.message.type === "CHAT_MESSAGE") {
              // Fixes timezone problems but is very easy to work around
              const now = createDateWithFallback(parsedData.message.payload.currentDate);
              const dateDiff = now.getTime() - player.lastSentMessage.getTime();
              if (dateDiff <= RATELIMIT_MESSAGE_IN_MS) {
                player.ws.send(
                  toPayloadToClient(
                    lobby.id,
                    createNewMessageToClient(lobby.id, "ERROR_MESSAGE", {
                      errorMessage: `Wait ${(RATELIMIT_MESSAGE_IN_MS - dateDiff).toFixed(
                        1
                      )}s before sending another message.`,
                    })
                  )
                );
                player.ws.send(
                  toPayloadToClient(
                    lobby.id,
                    createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
                      isOk: false,
                      messageId: parsedData.message.payload.messageId,
                      type: false,
                      rateLimitExpirationTime: now.getTime() + RATELIMIT_MESSAGE_IN_MS - dateDiff,
                    })
                  )
                );

                return;
              } else {
                player.lastSentMessage = now;
              }
            }

            if (isLobbyState(lobby, "lobby"))
              handleLobbyEvent(lobby, parsedData as FromMessageOnServerByStateType<"lobby">);
            else if (isLobbyState(lobby, "picking"))
              handlePickingEvent(lobby, parsedData as FromMessageOnServerByStateType<"picking">);
            else if (isLobbyState(lobby, "guessing"))
              handleGuessingEvent(lobby, parsedData as FromMessageOnServerByStateType<"guessing">);
            else if (isLobbyState(lobby, "leaderboard"))
              handleLeaderboardsEvent(
                lobby,
                parsedData as FromMessageOnServerByStateType<"leaderboard">
              );

            handleAllEvent(lobby, parsedData);
          } catch {}
        },
        onClose: (event, ws) => {
          const lobbyId = c.req.query("lobbyId");
          const lobbies = getLobbiesService().lobbies;
          const lobby = lobbies.get(lobbyId!);
          if (!lobby) return;

          const playerToDisconnect = getPlayerByWs(lobby, ws);
          if (!playerToDisconnect) return;

          if (lobby.stateProperties.state === "lobby" && lobby.stateProperties.type === "INITIAL") {
            if (!isDev()) removePlayerFromLobby(lobby, playerToDisconnect.privateId);

            lobbies.broadcast(
              lobbyId!,
              toPayloadToClient(
                playerToDisconnect.publicId,
                createNewMessageToClient(lobbyId!, "PLAYER_REMOVED_FROM_LOBBY", {
                  publicId: playerToDisconnect.publicId,
                })
              )
            );
          } else {
            playerToDisconnect.connectionStatus = "disconnected";

            lobbies.broadcast(
              lobbyId!,
              toPayloadToClient(
                playerToDisconnect.publicId,
                createNewMessageToClient(lobbyId!, "PLAYER_DATA_CHANGE", {
                  connectionStatus: "disconnected",
                })
              )
            );
          }

          if (playerToDisconnect.privateId === lobby.leaderPrivateId) {
            const player = changeLobbyLeaderToNextInArray(lobby, playerToDisconnect.privateId);
            if (player) {
              lobbies.broadcast(
                lobbyId!,
                toPayloadToClient(
                  playerToDisconnect.publicId,
                  createNewMessageToClient(lobbyId!, "PLAYER_DATA_CHANGE", {
                    isHost: false,
                  })
                )
              );
              lobbies.broadcast(
                lobbyId!,
                toPayloadToClient(
                  player.publicId,
                  createNewMessageToClient(lobbyId!, "PLAYER_DATA_CHANGE", {
                    isHost: true,
                  })
                )
              );
            }
          }

          if (lobby.players.length === 0 && !isDev()) lobbies.delete(lobby.id);
        },
      };
    })
  );
}

function changeLobbyLeaderToNextInArray(
  lobby: Lobby,
  currentLeaderPrivateId: string
): PlayerServer | undefined {
  for (const player of lobby.players) {
    if (player.privateId !== currentLeaderPrivateId && player.connectionStatus === "connected") {
      lobby.leaderPrivateId = player.privateId;
      return player;
    }
  }

  return;
}
