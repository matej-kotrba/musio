import {
  playerNameValidator,
  playerIconNameValidator,
  toPayloadToClient,
  createNewMessageToClient,
  fromMessageOnServer,
  type FromMessageOnServerByStateType,
} from "shared";
import { getRandomId } from "../common/utils";
import { handleAllEvent } from "../events/all";
import { handleGuessingEvent } from "../events/guessing";
import { handleLobbyEvent } from "../events/lobby";
import { handlePickingEvent } from "../events/picking";
import { getLobbiesService, createNewPlayer } from "../game/create";
import { isHost } from "../game/game-utils";
import { isLobbyState } from "../game/lobby";
import { removePlayerFromLobby } from "../game/player";
import type { Hono } from "hono";
import type { UpgradeWebSocket } from "hono/ws";

export default function setupWsEndpoints(app: Hono, upgradeWebSocket: UpgradeWebSocket) {
  app.get(
    "/ws",
    upgradeWebSocket((c) => {
      return {
        onOpen: (event, ws) => {
          console.log("adasdasdasd");
          const lobbyId = c.req.query("lobbyId");
          const name = c.req.query("name");
          const icon = c.req.query("icon");
          const lobbies = getLobbiesService().lobbies;

          if (
            !playerNameValidator.safeParse(name).success ||
            !playerIconNameValidator.safeParse(icon).success
          ) {
            console.log("Invalid name or icon provided");
            ws.close();
            return;
          }

          if (!lobbyId || !lobbies.has(lobbyId)) {
            console.log("Not sufficient lobbyId provided");
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

            handleAllEvent(lobby, parsedData);
          } catch {}
        },
        onClose: (event, ws) => {
          const lobbyId = c.req.query("lobbyId");
          const lobbies = getLobbiesService().lobbies;
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
}

function handleOnOpen() {}
