import type { APIEvent } from "@solidjs/start/server";
import { lobbies } from "~/server/lobby";

export async function GET() {
  console.log("Lobbies: ", lobbies);
  for (const [id, lobby] of lobbies) {
    console.log(id, lobby);
  }

  return Object.entries(lobbies.entries()).map(([id, lobby]) => ({
    id,
    players: lobby.players,
  }));
}
