import type { fromMessageOnServer } from "shared";
import type { Lobby } from "../lobby";
import { getPlayerByPrivateId } from "../player";
import { handleChatMessage } from "../game";

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
