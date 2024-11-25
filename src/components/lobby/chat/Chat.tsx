import styles from "./Chat.module.css";
import { createSignal } from "solid-js";
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
];

export default function Chat() {
  const [messages, setMessages] = createSignal<Message[]>(dummy_messages);

  return (
    <div class="flex flex-col gap-2">
      {messages().map((message) => {
        return <MessageComponent message={message} />;
      })}
      <ChatInput />
    </div>
  );
}

function MessageComponent(props: { message: Message }) {
  return (
    <div
      class={`${styles.message}`}
      classList={{
        "near bg-yellow-400 text-foreground-dark":
          props.message.isGuessRelated === "near",
        "relative bg-background-DEAFULT rounded-xl p-2 border-2 border-white border-opacity-20":
          true,
      }}
    >
      <span class="font-semibold opacity-75 text-ellipsis overflow-x-hidden whitespace-nowrap block">
        {props.message.senderName}
      </span>
      <p>{props.message.content}</p>
    </div>
  );
}
