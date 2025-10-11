// Id handling

import { setTimeout } from "timers/promises";
import type { Lobby } from "../game/lobby";

// ****
export function getRandomId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
// ****

// Dev utils
// ****
export function isDev() {
  return process.env.ENV === "DEVELOPMENT";
}
// ****

// Random utils
// ****
export function parseCookie(cookie: string | undefined, ...keys: string[]) {
  if (!cookie) return [];

  const result: (string | null)[] = [];
  const splitted = cookie.split(";");
  $outer: for (const key of keys) {
    for (const part of splitted) {
      if (part.includes(`${key}=`)) {
        result.push(part.split("=")[1]);
        continue $outer;
      }
    }

    result.push(null);
  }

  return result;
}

export function shuffleArray<T extends unknown[]>(arr: T) {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
}

export function abortLobbyTimeoutSignalAndRemoveIt(lobby: Lobby) {
  if (lobby.data.currentTimeoutAbortController) {
    lobby.data.currentTimeoutAbortController.abort();
    delete lobby.data.currentTimeoutAbortController;
  }
}

export async function waitFor(ms: number, signal?: AbortSignal) {
  return new Promise((resolve) =>
    setTimeout(ms, null, { signal: signal })
      .catch((e) => {})
      .finally(() => resolve("done"))
  );
}

export function normalizeString(str: string) {
  const strTrimmed = str.trim();
  let output = "";

  let normalized = strTrimmed.normalize("NFD");
  let i = 0;
  let j = 0;

  while (i < strTrimmed.length) {
    output += normalized[j];

    j += strTrimmed[i] == normalized[j] ? 1 : 2;
    i++;
  }

  return output;
}
// ****
