import {
  playerNameValidator,
  playerIconNameValidator,
  toPayloadToClient,
  createNewMessageToClient,
  fromMessageOnServer,
  type FromMessageOnServerByStateType,
} from "shared";
import { getRandomId, parseCookie } from "../common/utils";
import { handleAllEvent } from "../events/all";
import { handleGuessingEvent } from "../events/guessing";
import { handleLobbyEvent } from "../events/lobby";
import { handlePickingEvent } from "../events/picking";
import { getLobbiesService, createNewPlayer, createNewLobby } from "../game/create";
import { isHost } from "../game/game-utils";
import { isLobbyState } from "../game/lobby";
import { getPlayerByPrivateId, getPlayerByWs, removePlayerFromLobby } from "../game/player";
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
          const [cookiePrivateId] = parseCookie(cookie, "privateId");

          const lobbyId = c.req.query("lobbyId");
          const name = c.req.query("name");
          const icon = c.req.query("icon");
          const lobbies = getLobbiesService().lobbies;

          console.log("cookiePrivateId", cookiePrivateId);

          if (
            !playerNameValidator.safeParse(name).success ||
            !playerIconNameValidator.safeParse(icon).success
          ) {
            console.log("Invalid name or icon provided");
            ws.close();
            return;
          }

          let lobby = lobbies.get(lobbyId!);

          if (!lobby) lobby = createNewLobby(lobbies);

          const reconnectedPlayer = getPlayerByPrivateId(lobby, cookiePrivateId as string);

          if (!reconnectedPlayer) {
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
                    ...player,
                    isHost: isHost(player.privateId, lobby!),
                  })),
                  thisPlayerPrivateId: newPlayer.privateId,
                  thisPlayerPublicId: newPlayer.publicId,
                  gameOptions: lobby!.options,
                })
              )
            );

            lobbies.publish(
              lobby.id,
              newPlayer.privateId,
              toPayloadToClient(
                "server",
                createNewMessageToClient(lobby!.id, "PLAYER_JOIN", {
                  ...newPlayer,
                  isHost: isHost(newPlayer.privateId, lobby!),
                })
              )
            );
          } else {
            reconnectedPlayer.ws = ws;

            console.log("[ws] open - ", reconnectedPlayer.name);
            ws.send(
              toPayloadToClient(
                "server",
                createNewMessageToClient(lobby!.id, "PLAYER_INIT", {
                  allPlayers: lobby!.players.map((player) => ({
                    ...player,
                    isHost: isHost(player.privateId, lobby!),
                  })),
                  thisPlayerPrivateId: reconnectedPlayer.privateId,
                  thisPlayerPublicId: reconnectedPlayer.publicId,
                  gameOptions: lobby!.options,
                  gameStateData: lobby!.stateProperties,
                })
              )
            );

            lobbies.broadcast(
              lobbyId!,
              toPayloadToClient(
                reconnectedPlayer.publicId,
                createNewMessageToClient(lobbyId!, "PLAYER_STATUS_CHANGE", {
                  newStatus: "connected",
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

          lobbies.broadcast(
            lobbyId!,
            toPayloadToClient(
              playerToDisconnect.publicId,
              createNewMessageToClient(lobbyId!, "PLAYER_STATUS_CHANGE", {
                newStatus: "disconnected",
              })
            )
          );

          //TODO: Delete if empty

          // const removedPlayer = removePlayerFromLobby(lobby, ws);

          // lobbies.broadcast(
          //   lobbyId!,
          //   toPayloadToClient(
          //     "server",
          //     createNewMessageToClient(lobbyId!, "PLAYER_REMOVED_FROM_LOBBY", {
          //       publicId: removedPlayer!.publicId,
          //     })
          //   )
          // );
        },
      };
    })
  );
}
