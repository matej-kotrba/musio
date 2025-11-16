import styles from "./Chat.module.css";
import { createEffect, For, Show } from "solid-js";
import ChatInput from "./ChatInput";
import type { ChatMessage } from "shared";
import { useGameStore } from "~/routes/lobby/stores/game-store";

// const dummy_messages: Message[] = [
//   {
//     senderName: "Erik",
//     content: "Hymn for the Weekend",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Monody",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Rocks Bottom",
//     guessRelation: "near",
//   },
//   {
//     senderName: "Hrna",
//     content: "Clarity",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Rock Bottom",
//     guessRelation: "guessed",
//   },
//   {
//     senderName: "Dustix",
//     content: "Love to Lose",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dustix",
//     content:
//       "Love to Lose asuoidh auwuid aiuwd iuawhuidgi awdia gdygayida uidhauihsdljashdhasjkdhjakdhuauwdhaiwduawd",
//     guessRelation: false,
//   },
//   {
//     senderName: "Erik",
//     content: "Hymn for the Weekend",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Monody",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Rocks Bottom",
//     guessRelation: "near",
//   },
//   {
//     senderName: "Hrna",
//     content: "Clarity",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Rock Bottom",
//     guessRelation: "guessed",
//   },
//   {
//     senderName: "Dustix",
//     content: "Love to Lose",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dustix",
//     content:
//       "Love to Lose asuoidh auwuid aiuwd iuawhuidgi awdia gdygayida uidhauihsdljashdhasjkdhjakdhuauwdhaiwduawd",
//     guessRelation: false,
//   },
//   {
//     senderName: "Erik",
//     content: "Hymn for the Weekend",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Monody",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Rocks Bottom",
//     guessRelation: "near",
//   },
//   {
//     senderName: "Hrna",
//     content: "Clarity",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dr. House",
//     content: "Rock Bottom",
//     guessRelation: "guessed",
//   },
//   {
//     senderName: "Dustix",
//     content: "Love to Lose",
//     guessRelation: false,
//   },
//   {
//     senderName: "Dustix",
//     content:
//       "Love to Lose asuoidh auwuid aiuwd iuawhuidgi awdia gdygayida uidhauihsdljashdhasjkdhjakdhuauwdhaiwduawd",
//     guessRelation: false,
//   },
// ];

type ChatProps = {
  messages: ChatMessage[];
  onChatMessage: (content: string) => void;
  disabled?: boolean;
};

export default function Chat(props: ChatProps) {
  const [_, { queries }] = useGameStore();
  let chatRef!: HTMLDivElement;

  createEffect(() => {
    props.messages.length;

    chatRef.scrollTo({ top: chatRef.scrollHeight });
  });

  function createNewMessage(value: string) {
    props.onChatMessage(value);
  }

  return (
    <div class="h-80 md:h-full grid grid-rows-[1fr,auto] gap-2">
      <div
        ref={chatRef}
        class={`${styles.messages__mask} flex flex-col gap-2 overflow-y-auto pr-2`}
      >
        <div class="flex-1"></div>
        <For each={props.messages}>
          {(message) => (
            <Message
              message={message}
              isFromThisPlayer={queries.getThisPlayer()?.publicId === message.senderPublicId}
            />
          )}
        </For>
      </div>
      <ChatInput onSubmit={createNewMessage} disabled={props.disabled} />
    </div>
  );
}

type MessageProps = {
  message: ChatMessage;
  isFromThisPlayer?: boolean;
};

function Message(props: MessageProps) {
  return (
    <div
      class={`${styles.message} data-[optimistic=true]:opacity-50`}
      classList={{
        "bg-blue-950 text-foreground-DEFAULT border-blue-200": props.message.isSystem,
        "bg-yellow-400 text-foreground-dark border-yellow-600 border-opacity-100":
          props.message.guessRelation === "near",
        "bg-green-600 border-green-800 border-opacity-100":
          props.message.guessRelation === "guessed",
        "relative bg-background-DEAFULT rounded-sm md:rounded-xl p-1 md:p-2 border md:border-2 border-white border-opacity-20":
          true,
      }}
      data-near={props.message.guessRelation === "near"}
      data-guessed={props.message.guessRelation === "guessed"}
      data-optimistic={props.message.isOptimistic}
    >
      <div class="flex items-center gap-2">
        <span class="font-semibold text-xs md:text-sm opacity-75 text-ellipsis overflow-x-hidden whitespace-nowrap block">
          {props.message.isSystem ? "System" : props.message.senderName}
        </span>
        <Show when={props.isFromThisPlayer}>
          <div class="border border-green-400 rounded-md text-green-400 text-xs px-1.5 py-0.5">
            You
          </div>
        </Show>
      </div>
      <p class="hyphens-auto text-sm md:text-base">{props.message.content}</p>
    </div>
  );
}
