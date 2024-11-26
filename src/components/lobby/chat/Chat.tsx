import styles from "./Chat.module.css";
import { createEffect, createSignal } from "solid-js";
import ChatInput from "./ChatInput";

type Message = {
  senderName: string;
  content: string;
  isGuessRelated: "near" | "guessed" | false;
};

const dummy_messages: Message[] = [
  {
    senderName: "Erik",
    content: "Hymn for the Weekend",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Monody",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Rocks Bottom",
    isGuessRelated: "near",
  },
  {
    senderName: "Hrna",
    content: "Clarity",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Rock Bottom",
    isGuessRelated: "guessed",
  },
  {
    senderName: "Dustix",
    content: "Love to Lose",
    isGuessRelated: false,
  },
  {
    senderName: "Dustix",
    content:
      "Love to Lose asuoidh auwuid aiuwd iuawhuidgi awdia gdygayida uidhauihsdljashdhasjkdhjakdhuauwdhaiwduawd",
    isGuessRelated: false,
  },
  {
    senderName: "Erik",
    content: "Hymn for the Weekend",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Monody",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Rocks Bottom",
    isGuessRelated: "near",
  },
  {
    senderName: "Hrna",
    content: "Clarity",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Rock Bottom",
    isGuessRelated: "guessed",
  },
  {
    senderName: "Dustix",
    content: "Love to Lose",
    isGuessRelated: false,
  },
  {
    senderName: "Dustix",
    content:
      "Love to Lose asuoidh auwuid aiuwd iuawhuidgi awdia gdygayida uidhauihsdljashdhasjkdhjakdhuauwdhaiwduawd",
    isGuessRelated: false,
  },
  {
    senderName: "Erik",
    content: "Hymn for the Weekend",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Monody",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Rocks Bottom",
    isGuessRelated: "near",
  },
  {
    senderName: "Hrna",
    content: "Clarity",
    isGuessRelated: false,
  },
  {
    senderName: "Dr. House",
    content: "Rock Bottom",
    isGuessRelated: "guessed",
  },
  {
    senderName: "Dustix",
    content: "Love to Lose",
    isGuessRelated: false,
  },
  {
    senderName: "Dustix",
    content:
      "Love to Lose asuoidh auwuid aiuwd iuawhuidgi awdia gdygayida uidhauihsdljashdhasjkdhjakdhuauwdhaiwduawd",
    isGuessRelated: false,
  },
];

export default function Chat() {
  const [messages, setMessages] = createSignal<Message[]>(dummy_messages);
  let chatRef!: HTMLDivElement;

  createEffect(() => {
    messages();

    chatRef.scrollTo({ top: chatRef.scrollHeight });
  });

  function createNewMessage(value: string) {
    const newMessage: Message = {
      content: value,
      isGuessRelated: false,
      senderName: "Dr. House",
    };

    setMessages((old) => [...old, newMessage]);
  }

  return (
    <div ref={chatRef} class="h-full grid grid-rows-[1fr,auto] gap-2">
      <div
        ref={chatRef}
        class={`${styles.messages__mask} flex flex-col gap-2 overflow-y-auto`}
      >
        {messages().map((message) => {
          return <MessageComponent message={message} />;
        })}
      </div>
      <ChatInput onSubmit={createNewMessage} />
    </div>
  );
}

function MessageComponent(props: { message: Message }) {
  return (
    <div
      class={`${styles.message}`}
      classList={{
        "bg-yellow-400 text-foreground-dark border-yellow-600 border-opacity-100":
          props.message.isGuessRelated === "near",
        "bg-green-500 border-green-800 border-opacity-100":
          props.message.isGuessRelated === "guessed",
        "relative bg-background-DEAFULT rounded-xl p-2 border-2 border-white border-opacity-20":
          true,
      }}
      data-near={props.message.isGuessRelated === "near"}
      data-guessed={props.message.isGuessRelated === "guessed"}
    >
      <span class="font-semibold opacity-75 text-ellipsis overflow-x-hidden whitespace-nowrap block">
        {props.message.senderName}
      </span>
      <p class="hyphens-auto">{props.message.content}</p>
    </div>
  );
}
