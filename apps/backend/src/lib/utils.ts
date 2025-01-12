// Id handling

import type { Lobby } from "./lobby";

// ****
export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
// ****

// Dev utils
// ****
export function isDev() {
  return process.env.NODE_ENV === "development";
}
// ****

// Random utils
// ****
export function shuffleArray<T extends unknown[]>(arr: T) {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
}

export function abortLobbyTimeoutSignalAndRemove(lobby: Lobby) {
  if (lobby.data.currentTimeoutAbortController) {
    lobby.data.currentTimeoutAbortController.abort();
    delete lobby.data.currentTimeoutAbortController;
  }
}

export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeString(str: string) {
  let output = "";

  let normalized = str.normalize("NFD");
  let i = 0;
  let j = 0;

  while (i < str.length) {
    output += normalized[j];

    j += str[i] == normalized[j] ? 1 : 2;
    i++;
  }

  return output;
}
// ****
