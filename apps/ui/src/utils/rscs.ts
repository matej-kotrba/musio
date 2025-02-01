"use server";

import { constructURL, getServerURL } from "shared";

// Returns relative URL path to correct lobby
// TODO: Add error handling
export const getLobbyURL = async (lobbyId?: string) => {
  const serverResponse = await fetch(constructURL(getServerURL(), `getLobbyId?lobbyId=${lobbyId}`));
  return (await serverResponse.json()) as string;
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
