import type { fromMessageOnServer } from "shared";
import type { Lobby } from "../lobby";
import { getPlayerByPrivateId } from "../player";
import { handleChatMessage } from "../game";

export function handleAllEvent(lobby: Lobby, data: ReturnType<typeof fromMessageOnServer>) {
  switch (data.message.type) {
    case "CHAT_MESSAGE":
      const player = getPlayerByPrivateId(lobby, data.privateId);
      if (!player) return;

      const { content, messageId } = data.message.payload;
      handleChatMessage(player, lobby, { messageId, content });
  }
}
