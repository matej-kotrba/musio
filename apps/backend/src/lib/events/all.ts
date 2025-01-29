import { createNewMessageToClient, toPayloadToClient, type fromMessageOnServer } from "shared";
import type { Lobby } from "../game/lobby";
import { getPlayerByPrivateId, type PlayerServer } from "../game/player";
import { getLobbiesService } from "../game/create";

export function handleAllEvent(lobby: Lobby, data: ReturnType<typeof fromMessageOnServer>) {
  switch (data.message.type) {
    case "CHAT_MESSAGE":
      const { content, messageId } = data.message.payload;
      const player = getPlayerByPrivateId(lobby, data.privateId);

      // If the lobby is not in the guessing state, chat messages are used for guesses
      if (lobby.stateProperties.state === "guessing") return;
      if (!player) return;

      handleChatMessage(player, lobby, { messageId, content });
  }
}

export function handleChatMessage(
  player: PlayerServer,
  lobby: Lobby,
  { messageId, content }: { messageId: string; content: string }
) {
  player.ws.send(
    toPayloadToClient(
      lobby.id,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
        isOk: true,
        messageId,
        type: false,
      })
    )
  );

  getLobbiesService().lobbies.publish(
    lobby.id,
    player.privateId,
    toPayloadToClient(
      player.publicId,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE", {
        content: content,
      })
    )
  );
}
