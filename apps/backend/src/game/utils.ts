import { createNewMessageToClient } from "shared";

export const userIdFromId = (id: string) => id.slice(-6);

export const toPayload = (
  from: String,
  message: ReturnType<typeof createNewMessageToClient>
) => JSON.stringify({ user: from, message: message });

export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
