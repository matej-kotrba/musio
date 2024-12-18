"use server";

import { createNewLobby, lobbies } from "~/server/lobby";

// Returns relative URL path to correct lobby
export const getLobbyURL = async (lobbyId?: string) => {
  if (!lobbyId || !lobbies.has(lobbyId)) {
    const newLobby = createNewLobby();

    return `/lobby/${newLobby.id}`;
  }

  return `/lobby/${lobbyId}`;
};

// Removes lobby from lobbies map if the lobby is empty
export const removeLobbyWhenEmpty = (lobbyId: string) => {
  console.log("Removing lobby", lobbyId);
  const lobby = lobbies.get(lobbyId);

  console.log(lobbies, lobby);
  if (!lobby || lobby.players.length > 0) return;
  lobbies.delete(lobbyId);

  for (const [id, name] of lobbies) {
    console.log(id, name);
  }
};
