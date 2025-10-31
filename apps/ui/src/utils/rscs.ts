"use server";

import { constructURL } from "shared";

// Returns relative URL path to correct lobby
// TODO: Add error handling
export const getLobbyURL = async (serverUrl?: string, lobbyId?: string) => {
  if (!serverUrl) return;

  const serverResponse = await fetch(
    constructURL(serverUrl, `getOrCreateLobbyById?lobbyId=${lobbyId}`),
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
  const data = (await serverResponse.json()) as string;

  return data;
};
