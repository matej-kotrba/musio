import index from "./index.module.css";
import { A } from "@solidjs/router";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <div class="">
        <h1 class="text-6xl text-primary font-bold my-16">Musio</h1>
      </div>
      <div
        class={`${index.host__join} relative mx-auto text-foreground text-2xl font-semibold w-[32rem] flex`}
      >
        <button
          type="button"
          class="grow-[1] py-8 hover:grow-[2] duration-150 relative"
        >
          Host
        </button>
        <div
          class={`${index.host__join__separator} w-1 bg-primary rounded-md`}
        ></div>
        <button
          type="button"
          class="grow-[1] py-8 hover:grow-[2] duration-150 relative"
        >
          Join
        </button>
      </div>
    </main>
  );
}
