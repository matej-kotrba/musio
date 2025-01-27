import {
  createNewMessageToClient,
  toPayloadToClient,
  type FromMessageOnServerByStateType,
} from "shared";
import { changeToGuessingGameLobbyState, type Lobby } from "../lobby";
import { getPlayerByPrivateId } from "../player";
import { createNewSong, getLobbiesService } from "../create";
import { normalizeString } from "../utils";

export function handleLobbyEvent(
  lobby: Lobby<"picking">,
  data: FromMessageOnServerByStateType<"picking">
) {
  const lobbies = getLobbiesService().lobbies;

  switch (data.message.type) {
    case "PICK_SONG":
      const player = getPlayerByPrivateId(lobby, data.privateId);

      if (!player) return;
      if (lobby.stateProperties.playersWhoPickedIds.includes(data.privateId)) return;

      const { name, artist, trackUrl, imageUrl100x100 } = data.message.payload;

      const newSong = createNewSong(
        normalizeString(name),
        artist,
        trackUrl,
        imageUrl100x100,
        player.publicId
      );
      lobby.data.pickedSongs.push(newSong);

      if (lobby.data.pickedSongs.length === lobby.players.length) {
        changeToGuessingGameLobbyState(lobbies, lobby);
      } else {
        lobbies.broadcast(
          lobby.id,
          toPayloadToClient(
            player.publicId,
            createNewMessageToClient(lobby.id, "PLAYER_PICKED_SONG", {})
          )
        );
      }

      break;
  }
}
