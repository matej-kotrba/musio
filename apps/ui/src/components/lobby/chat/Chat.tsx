import styles from "./Chat.module.css";
import { createEffect } from "solid-js";
import ChatInput from "./ChatInput";
import type { ChatMessage } from "shared";

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
};

export default function Chat(props: ChatProps) {
  let chatRef!: HTMLDivElement;

  createEffect(() => {
    props.messages;

    chatRef.scrollTo({ top: chatRef.scrollHeight });
  });

  function createNewMessage(value: string) {
    props.onChatMessage(value);
  }

  return (
    <div class="h-full grid grid-rows-[1fr,auto] gap-2">
      <div
        ref={chatRef}
        class={`${styles.messages__mask} flex flex-col gap-2 overflow-y-auto pr-2`}
      >
        <div class="flex-1"></div>
        {props.messages.map((message) => {
          return <MessageComponent message={message} />;
        })}
      </div>
      <ChatInput onSubmit={createNewMessage} />
    </div>
  );
}

function MessageComponent(props: { message: ChatMessage }) {
  return (
    <div
      class={`${styles.message} data-[optimistic=true]:opacity-50`}
      classList={{
        "bg-yellow-400 text-foreground-dark border-yellow-600 border-opacity-100":
          props.message.guessRelation === "near",
        "bg-green-600 border-green-800 border-opacity-100":
          props.message.guessRelation === "guessed",
        "relative bg-background-DEAFULT rounded-xl p-2 border-2 border-white border-opacity-20":
          true,
      }}
      data-near={props.message.guessRelation === "near"}
      data-guessed={props.message.guessRelation === "guessed"}
      data-optimistic={props.message.isOptimistic}
    >
      <span class="font-semibold opacity-75 text-ellipsis overflow-x-hidden whitespace-nowrap block">
        {props.message.senderName}
      </span>
      <p class="hyphens-auto">{props.message.content}</p>
    </div>
  );
}
