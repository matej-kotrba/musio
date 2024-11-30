import { eventHandler } from "vinxi/http";
import { Player } from "~/components/lobby/Player";
import { WS_MESSAGE_TYPE, WS_MessageInterface } from "~/utils/game/connection";

type PlayerServer = Omit<Player, "icon"> & {
  icon: string;
};

const userIdFromId = (id: string) => id.slice(-6);

// Don't want to send binary Blob to the client
const toPayload = (from: String, message: string) =>
  JSON.stringify({ user: from, message: message });

const CHANNEL_NAME = "chat";
const SERVER_ID = "server";

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
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return;
  }

  lobby.players.push(player);
  console.log("Player joined", player);
}

function createNewLobby(id: string) {
  lobbies.set(id, {
    id,
    players: [],
  });
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

      const playerId = userIdFromId(peer.id);
      peer.send(toPayload(SERVER_ID, `Welcome ${playerId}`));

      const lobby = lobbies.get(lobbyId);
      if (!lobby) {
        createNewLobby(lobbyId);
      }

      // Join new client to the "chat" channel
      peer.subscribe(lobbyId);
      // Notify every other connected client
      peer.publish(lobbyId, toPayload(SERVER_ID, `${playerId} joined!`));
    },

    async message(peer, message) {
      const playerId = userIdFromId(peer.id);

      let parsedMessage: WS_MessageInterface[WS_MESSAGE_TYPE];
      try {
        parsedMessage = JSON.parse(message.text());
      } catch {
        console.log("Invalid message format");
        return;
      }

      switch (parsedMessage.type) {
        case "PLAYER_INIT": {
          console.log("Player init", parsedMessage.payload);
          for (const [key, value] of lobbies) {
            console.log(key, value);
          }
          const { name, icon } = parsedMessage.payload;
          initPlayerToLobby(
            parsedMessage.lobbyId,
            createNewPlayer(playerId, name, icon)
          );
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
      peer.publish(
        CHANNEL_NAME,
        toPayload(SERVER_ID, `${user} has left the chat!`)
      );
    },

    async error(peer, error) {
      console.log("[ws] error", userIdFromId(peer.id), error);
    },
  },
});
