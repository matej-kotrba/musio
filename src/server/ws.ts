import { eventHandler } from "vinxi/http";
import { Player } from "~/components/lobby/Player";

const userIdFromId = (id: string) => id.slice(-6);

// Don't want to send binary Blob to the client
const toPayload = (from: String, message: string) =>
  JSON.stringify({ user: from, message: message });

const CHANNEL_NAME = "chat";
const SERVER_ID = "server";

type Lobby = {
  id: string;
  players: Player[];
};

const lobbies = new Map<string, Lobby>();

function createNewLobby(id: string): Lobby {
  const existingLobby = lobbies.get(id);
  if (existingLobby) {
    return existingLobby;
  }

  return {
    id: id,
    players: [],
  };
}

function getLobbyIdFromPeer(peer: { url: string }) {
  const url = new URLSearchParams(peer.url.split("?")[1]);
  return url.get("id");
}

function joinUserToLobby(userId: string, lobbyId: string): boolean {
  const lobby = lobbies.get(lobbyId);
  if (!lobby) {
    return false;
  }
  return true;
  // lobby.players.push({});
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

      const user = userIdFromId(peer.id);
      peer.send(toPayload(SERVER_ID, `Welcome ${user}`));

      createNewLobby(lobbyId);

      // Join new client to the "chat" channel
      peer.subscribe(CHANNEL_NAME);
      // Notify every other connected client
      peer.publish(CHANNEL_NAME, toPayload(SERVER_ID, `${user} joined!`));
    },

    async message(peer, message) {
      const user = userIdFromId(peer.id);
      console.log("[ws] message", user, message);

      const content = message.text();
      if (content.includes("ping")) {
        peer.send("pong");
        return;
      }

      const payload = toPayload(peer.id, content);
      // The server re-broadcasts incoming messages to everyone …
      peer.publish(CHANNEL_NAME, payload);
      // … but the source
      peer.send(payload);
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
