import { eventHandler } from "vinxi/http";
import { Player } from "~/components/lobby/Player";

const userFromId = (id: string) => id.slice(-6);

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

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      console.log("[ws] open", peer);

      const url = new URLSearchParams(peer.url.split("?")[1]);
      console.log(url.get("id"));

      const user = userFromId(peer.id);
      peer.send(toPayload(SERVER_ID, `Welcome ${user}`));

      // Join new client to the "chat" channel
      peer.subscribe(CHANNEL_NAME);
      // Notify every other connected client
      peer.publish(CHANNEL_NAME, toPayload(SERVER_ID, `${user} joined!`));
    },

    async message(peer, message) {
      const user = userFromId(peer.id);
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
      const user = userFromId(peer.id);
      console.log("[ws] close", user, details);

      peer.unsubscribe(CHANNEL_NAME);
      peer.publish(
        CHANNEL_NAME,
        toPayload(SERVER_ID, `${user} has left the chat!`)
      );
    },

    async error(peer, error) {
      console.log("[ws] error", userFromId(peer.id), error);
    },
  },
});
