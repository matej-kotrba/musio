"use server";

import { redirect } from "@solidjs/router";

export const redirectToLobby = async (lobbyId?: string) => {
  console.log("LOBBIES");
  // if (!lobbyId) throw redirect("/lobby");
  return redirect("/asdasd");
};
