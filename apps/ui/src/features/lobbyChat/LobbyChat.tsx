import { createNewMessageToServer, toPayloadToServer, type ChatMessage } from "shared";
import { createUniqueId } from "solid-js";
import { useWsConnection } from "~/contexts/wsConnection";
import { useGameStore } from "~/routes/lobby/stores/game-store";
import Chat from "./components/Chat";
import toast from "solid-toast";

export default function LobbyChat() {
  const [gameStore, { queries, actions }] = useGameStore();
  const { getThisPlayer } = queries;
  const { setGameStore } = actions;
  const wsActions = useWsConnection();

  const handleChatMessage = (content: string) => {
    const thisPlayer = getThisPlayer();
    if (!gameStore.thisPlayerIds?.public || !thisPlayer) return;

    const now = new Date();
    const isRateLimitExpired =
      !gameStore.chatMessageRateLimitExpiration ||
      now.getTime() > gameStore.chatMessageRateLimitExpiration;
    if (isRateLimitExpired) {
      const newMessage: ChatMessage = {
        id: createUniqueId(),
        senderPublicId: thisPlayer.publicId,
        content: content,
        guessRelation: false,
        senderName: getThisPlayer()!.name,
        isOptimistic: true,
      };

      // Optimistically update messages
      setGameStore("chatMessages", gameStore.chatMessages.length, newMessage);

      wsActions.send?.(
        toPayloadToServer(
          gameStore.thisPlayerIds.private,
          createNewMessageToServer(gameStore.lobbyId, "CHAT_MESSAGE", {
            messageId: newMessage.id!,
            content,
            currentDate: new Date(),
          })
        )
      );
    } else {
      toast.error(
        `Wait ${(gameStore.chatMessageRateLimitExpiration! - now.getTime()).toFixed(
          0
        )}ms before sending another message.`
      );
    }
  };

  const isSongToGuessFromThisPlayer = () =>
    gameStore.currentSongToGuess?.fromPlayerByPublicId === gameStore.thisPlayerIds?.public;

  return (
    <aside
      class="h-full max-h-full w-80"
      style={{
        height: "var(--custom-height)",
      }}
    >
      <Chat
        messages={gameStore.chatMessages}
        onChatMessage={handleChatMessage}
        disabled={isSongToGuessFromThisPlayer()}
      />
    </aside>
  );
}
