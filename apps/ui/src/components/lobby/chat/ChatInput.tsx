import { createEffect, createSignal } from "solid-js";
import styles from "./ChatInput.module.css";
import { Icon } from "@iconify-icon/solid";

type Props = {
  onSubmit: (value: string) => void;
};

export default function ChatInput(props: Props) {
  const [inputValue, setInputValue] = createSignal("");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (inputValue() === "") return;

    props.onSubmit(inputValue());
    setInputValue("");
  }

  return (
    <form
      on:submit={handleSubmit}
      class={`${styles.input__wrapper} grid grid-flow-col rounded-full h-fit`}
    >
      <input
        type="text"
        placeholder="Guess the music"
        class="peer px-4 py-2 rounded-l-full bg-background-accent border-2 border-r-0 border-white border-opacity-30 outline-none focus-within:border-primary duration-100"
        value={inputValue()}
        on:input={(e) => setInputValue(e.currentTarget.value)}
      />
      <button
        type="submit"
        class="group peer-focus-within:border-primary grid content-center border-2 border-white border-opacity-30 rounded-r-full h-full duration-100"
      >
        <Icon icon="material-symbols:send-outline" class="text-4xl px-1" />
      </button>
    </form>
  );
}
