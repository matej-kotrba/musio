import index from "./index.module.css";

export default function Home() {
  return (
    <main class="text-center text-gray-700 p-4 container mx-auto">
      <div class={index.landing}>
        <div class="py-16">
          <h1 class={`${index.main__title} text-6xl font-bold my-16 uppercase`}>
            Musio
          </h1>
        </div>
        <div
          class={`${index.host__join} relative mx-auto text-foreground text-2xl font-semibold w-[32rem] h-24 flex bg-background-accent rounded-xl`}
        >
          <button
            type="button"
            class="grow-[1] hover:grow-[2] duration-150 relative"
          >
            Host
          </button>
          <div
            class={`${index.host__join__separator} w-1 bg-primary rounded-md h-[120%] translate-y-[-10%]`}
          ></div>
          <button
            type="button"
            class="grow-[1] hover:grow-[2] duration-150 relative"
          >
            Join
          </button>
        </div>
      </div>
      <div class="pb-[200rem]"></div>
    </main>
  );
}
