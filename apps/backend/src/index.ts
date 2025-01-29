import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import { isLobbyState } from "./lib/lobby.js";
import { getRandomId, isDev, normalizeString } from "./lib/utils.js";
import {
  playerNameValidator,
  playerIconNameValidator,
  createNewMessageToClient,
  toPayloadToClient,
  messageLengthSchema,
  fromMessageOnServer,
  type FromMessageOnServerByStateType,
} from "shared";
import { getReceivedPoints, isHost } from "./lib/game.js";
import { createNewLobby, createNewPlayer, getLobbiesService } from "./lib/create.js";
import { getPlayerByPrivateId, removePlayerFromLobby } from "./lib/player.js";
import { stringSimilarity } from "string-similarity-js";
import { handleLobbyEvent } from "./lib/events/lobby.js";
import { handlePickingEvent } from "./lib/events/picking.js";
import { handleGuessingEvent } from "./lib/events/guessing.js";
import { handleAllEvent } from "./lib/events/all.js";

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// const lobbies: LobbiesMap = new LobbyMap<string, Lobby>();

// Dev only endpoints
// ****
app.get("/getLobbies", (c) => {
  if (isDev()) return c.notFound();

  return c.json([...getLobbiesService().lobbies.keys()]);
});

app.get("/purgeLobbies", (c) => {
  if (isDev()) return c.notFound();

  getLobbiesService().lobbies.clear();
  return c.json("Lobbies purged");
});

app.get("/getLobby", (c) => {
  if (isDev()) return c.notFound();

  return c.json(getLobbiesService().lobbies.get(c.req.query("lobbyId")!));
});

app.get("/calculatePoints", (c) => {
  if (isDev()) return c.notFound();

  return c.json(getReceivedPoints(0, 1737400500295, 1737400499241, 10000));
});
// ****

app.get("/getLobbyId", (c) => {
  const lobbyId = c.req.query("lobbyId");
  const lobbies = getLobbiesService().lobbies;

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
        // eventsHandleService.reset();

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

const port = 5173;
console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});
injectWebSocket(server);
