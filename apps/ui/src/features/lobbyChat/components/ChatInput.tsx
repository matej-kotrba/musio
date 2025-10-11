import { createEffect, createSignal, on } from "solid-js";
import styles from "./ChatInput.module.css";
import { Icon } from "@iconify-icon/solid";
import clsx from "clsx";
import { messageLengthSchema } from "shared";
import toast from "solid-toast";
import { useGameStore } from "~/routes/lobby/stores/game-store";

type Props = {
  onSubmit: (value: string) => void;
  class?: string;
  disabled?: boolean;
};

export default function ChatInput(props: Props) {
  const [gameStore] = useGameStore();
  const [inputValue, setInputValue] = createSignal("");

  const clearInput = () => setInputValue("");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (isEmpty(inputValue())) return;

    const validationResult = isValid(inputValue());
    if (validationResult.success) {
      props.onSubmit(inputValue());
    } else {
      toast.error(validationResult.message);
    }

    clearInput();
  }

  function isEmpty(message: string) {
    return message.length === 0;
  }

  function isValid(message: string): { success: boolean; message?: string } {
    const messageLengthValidation = messageLengthSchema.safeParse(message);
    if (!messageLengthValidation.success) {
      return { success: false, message: messageLengthValidation.error.errors[0].message };
    }

    return { success: true };
  }

  createEffect(() => {
    // When song to guess changes we wan't to clear the input
    gameStore.currentSongToGuess;

    clearInput();
  });

  return (
    <form
      on:submit={handleSubmit}
      class={clsx(`${styles.input__wrapper} grid grid-flow-col rounded-full h-fit`, props.class)}
    >
      <input
        type="text"
        placeholder={props.disabled ? "Can't guess your own song" : "Guess the music"}
        class="peer px-4 py-2 rounded-l-full bg-background-accent border-2 border-r-0 border-white border-opacity-30 outline-none focus-within:border-primary duration-100"
        value={inputValue()}
        on:input={(e) => setInputValue(e.currentTarget.value)}
        disabled={!!props.disabled}
      />
      <button
        type="submit"
        class="group peer-focus-within:border-primary grid content-center border-2 border-white border-opacity-30 rounded-r-full h-full duration-100"
        disabled={!!props.disabled}
      >
        <Icon icon="material-symbols:send-outline" class="text-4xl px-1" />
      </button>
    </form>
  );
}
