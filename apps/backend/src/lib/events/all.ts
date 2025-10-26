import {
  createNewMessageToClient,
  messageLengthSchema,
  RATELIMIT_MESSAGE_IN_MS,
  toPayloadToClient,
  type fromMessageOnServer,
} from "shared";
import type { Lobby } from "../game/lobby";
import { getPlayerByPrivateId, type PlayerServer } from "../game/player";
import { getLobbiesService } from "../game/create";
import { createDateWithFallback } from "../common/utils";

export function handleAllEvent(lobby: Lobby, data: ReturnType<typeof fromMessageOnServer>) {
  switch (data.message.type) {
    case "CHAT_MESSAGE":
      const { content, messageId, currentDate } = data.message.payload;
      const now = createDateWithFallback(currentDate);
      const player = getPlayerByPrivateId(lobby, data.privateId);

      // If the lobby is not in the guessing state, chat messages are used for guesses
      if (lobby.stateProperties.state === "guessing") return;
      if (!player) return;

      handleChatMessage(player, lobby, { messageId, content, now });
  }
}

export function handleChatMessage(
  player: PlayerServer,
  lobby: Lobby,
  { messageId, content, now }: { messageId: string; content: string; now: Date }
) {
  const messageLengthValidation = messageLengthSchema.safeParse(content);
  if (!messageLengthValidation.success) {
    player.ws.send(
      toPayloadToClient(
        lobby.id,
        createNewMessageToClient(lobby.id, "ERROR_MESSAGE", {
          errorMessage: `${messageLengthValidation.error.errors[0].message}`,
        })
      )
    );

    player.ws.send(
      toPayloadToClient(
        lobby.id,
        createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
          isOk: false,
          messageId,
          type: false,
          rateLimitExpirationTime: now.getTime() + RATELIMIT_MESSAGE_IN_MS,
        })
      )
    );

    return;
  }

  player.ws.send(
    toPayloadToClient(
      lobby.id,
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
        isOk: true,
        messageId,
        type: false,
        rateLimitExpirationTime: now.getTime() + RATELIMIT_MESSAGE_IN_MS,
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
