import type { Lobby } from "./lobby";

export class LobbyMap<K extends string, V extends Lobby> extends Map<K, V> {
  publish(lobbyId: K, senderId: string, message: string) {
    const lobby = this.get(lobbyId);
    if (!lobby) return;

    lobby.players.forEach((player) => {
      if (player.privateId === senderId) return;
      player.ws.send(message);
    });
  }

  broadcast(lobbyId: K, message: string) {
    const lobby = this.get(lobbyId);
    if (!lobby) return;

    lobby.players.forEach((player) => {
      player.ws.send(message);
    });
  }
}
