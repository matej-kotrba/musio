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

// // Removes lobby from lobbies map if the lobby is empty
// export const removeLobbyWhenEmpty = (lobbyId: string) => {
//   // console.log("Removing lobby", lobbyId);
//   const lobby = getLobbies().get(lobbyId);

//   // console.log(lobbies, lobby);
//   if (!lobby || lobby.players.length > 0) return;
//   getLobbies().delete(lobbyId);

//   for (const [id, name] of getLobbies()) {
//     console.log(id, name);
//   }
// };
