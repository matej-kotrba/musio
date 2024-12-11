import { eventHandler } from "vinxi/http";
import { Player } from "~/components/lobby/Player";
import {
  createNewMessageToClient,
  createNewMessageToServer,
  WS_MESSAGE_TO_SERVER_TYPE,
  WS_MessageInterface,
  WS_MessageMapServer,
} from "~/utils/game/connection";
import { addBroadcast, getRandomId, toPayload, userIdFromId } from "./utils";

const CHANNEL_NAME = "chat";
const SERVER_ID = "server";

type PlayerServer = Omit<Player, "icon"> & {
  icon: string;
};

type Lobby = {
  id: string;
  players: PlayerServer[];
};

const lobbies = new Map<string, Lobby>();

function getLobbyIdFromPeer(peer: { url: string }) {
  const url = new URLSearchParams(peer.url.split("?")[1]);
  return url.get("id");
}

function createNewPlayer(
  id: string,
  name: string,
  icon: string,
  points?: number
): PlayerServer {
  return {
    id,
    name,
    icon,
    points: points ?? 0,
  };
}

function initPlayerToLobby(lobbyId: string, player: PlayerServer) {
  console.log("Lobby: ", lobbyId);
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return;
  }

  lobby.players.push(player);
  console.log("Player joined", player);

  return player;
}

function createNewLobby() {
  const id = getRandomId();
  const lobby = {
    id,
    players: [],
  };

  lobbies.set(id, lobby);
  return lobby;
}

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      console.log("[ws] open", peer);

      const lobbyId = getLobbyIdFromPeer(peer);
      if (!lobbyId) {
        console.log("No lobby id found in query params");
        return;
      }

      console.log("ID: ", peer.id);
      // const playerId = userIdFromId(peer.id);
      // peer.send(toPayload(SERVER_ID, `Welcome ${playerId}`));

      let lobby = lobbies.get(lobbyId);
      let needToRedirect = false;
      if (!lobby) {
        lobby = createNewLobby();
        needToRedirect = true;
      }

      peer.subscribe(lobbyId);

      if (needToRedirect) {
        console.log("Redirecting to lobby", lobby.id);
        peer.send(
          toPayload(
            SERVER_ID,
            createNewMessageToClient(lobby.id, "REDIRECT_TO_LOBBY", {
              lobbyId: lobby.id,
            })
          )
        );
      }

      // Join new client to the "chat" channel

      // Notify every other connected client
      // peer.publish(lobbyId, toPayload(SERVER_ID, `${playerId} joined!`));
    },

    async message(peer, message) {
      // const peer = addBroadcast(p);
      const playerId = userIdFromId(peer.id);

      let parsedMessage: WS_MessageInterface<WS_MessageMapServer>[WS_MESSAGE_TO_SERVER_TYPE];
      try {
        parsedMessage = JSON.parse(message.text());
      } catch {
        console.log("Invalid message format");
        return;
      }

      console.log("[ws] message", playerId, parsedMessage);
      switch (parsedMessage.type) {
        case "PLAYER_INIT": {
          const { name, icon } = parsedMessage.payload;
          const newPlayer = initPlayerToLobby(
            parsedMessage.lobbyId,
            createNewPlayer(playerId, name, icon)
          );
          if (!newPlayer) return;

          // peer.broadcast()
          peer.send(
            toPayload(
              SERVER_ID,
              createNewMessageToClient(parsedMessage.lobbyId, "PLAYER_INIT", {
                name,
                icon,
                points: newPlayer.points,
              })
            )
          );
          peer.publish(
            parsedMessage.lobbyId,
            toPayload(
              SERVER_ID,
              createNewMessageToClient(parsedMessage.lobbyId, "PLAYER_INIT", {
                name,
                icon,
                points: newPlayer.points,
              })
            )
          );

          break;
        }
      }

      // The server re-broadcasts incoming messages to everyone …
      // peer.publish(CHANNEL_NAME, payload);
      // // … but the source
      // peer.send(payload);
    },

    async close(peer, details) {
      const user = userIdFromId(peer.id);
      console.log("[ws] close", user, details);

      peer.unsubscribe(CHANNEL_NAME);
      // peer.publish(
      //   CHANNEL_NAME
      //   toPayload(SERVER_ID, `${user} has left the chat!`)
      // );
    },

    async error(peer, error) {
      console.log("[ws] error", userIdFromId(peer.id), error);
    },
  },
});
