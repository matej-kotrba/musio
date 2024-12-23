import { createNewMessageToClient } from "shared";

// Id handling
// ****
export const userIdFromId = (id: string) => id.slice(-6);

export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
// ****

// Meesage handling
// ****
export const toPayload = (
  from: String,
  message: ReturnType<typeof createNewMessageToClient>
) => JSON.stringify({ user: from, message: message });
// ****

// Dev utils
// ****
export function isDev() {
  return process.env.NODE_ENV === "development";
}
// ****
