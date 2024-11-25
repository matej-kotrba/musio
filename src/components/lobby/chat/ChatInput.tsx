import { Icon } from "@iconify-icon/solid";

export default function ChatInput() {
  return (
    <div class="grid grid-flow-col">
      <input
        type="text"
        placeholder="Guess the music"
        class="peer px-4 py-2 rounded-l-full bg-background-accent border-2 border-r-0 border-white border-opacity-30 outline-none focus-within:border-primary duration-100"
      />
      <button
        type="button"
        class="peer-focus-within:border-primary grid content-center border-2 border-white border-opacity-30 rounded-r-full h-full duration-100"
      >
        <Icon icon="material-symbols:search" class="text-4xl px-1" />
      </button>
    </div>
  );
}
