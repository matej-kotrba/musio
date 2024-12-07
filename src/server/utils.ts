import { createNewMessageToClient } from "~/utils/game/connection";

export const userIdFromId = (id: string) => id.slice(-6);

export const toPayload = (
  from: String,
  message: ReturnType<typeof createNewMessageToClient>
) => JSON.stringify({ user: from, message: message });

export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

function wsPeerBroadcast(peer: any, topic: string, message: string) {
  peer.send(message);
  peer.publish(topic, message);
}

export function addBroadcast<T extends {}>(
  peer: T
): T & { broadcast: (peer: any, topic: string, message: string) => void } {
  return { ...peer, broadcast: wsPeerBroadcast };
}
