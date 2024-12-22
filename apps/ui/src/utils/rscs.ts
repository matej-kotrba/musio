"use server";

import { construstURL, getServerURL } from "shared";

// Returns relative URL path to correct lobby
export const getLobbyURL = async (lobbyId?: string) => {
  const serverResponse = await fetch(
    construstURL(getServerURL(), "getLobbyId")
  );
  const parsedData = await serverResponse.json();
  return parsedData;
  // console.log(getLobbies());
  // if (!lobbyId || !getLobbies().has(lobbyId)) {
  //   const newLobby = createNewLobby();
  //   return `/lobby/${newLobby.id}`;
  // }
  // return `/lobby/${lobbyId}`;
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
