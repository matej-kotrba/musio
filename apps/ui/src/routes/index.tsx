import { Index } from "solid-js";
import index from "./index.module.css";
import { Motion } from "solid-motionone";

export default function Home() {
  return (
    <main class="text-center text-gray-700 p-4 container mx-auto">
      <div class={index.landing}>
        <div class="py-16">
          <h1 class={`${index.main__title} text-6xl font-bold mb-1 text-foreground`}>
            <Motion.div
              class={`${index.main__title} inline-block`}
              initial={{ opacity: 0, scale: 0, x: 200 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5, easing: "ease" }}
            >
              M
            </Motion.div>
            <Index each={"usio".split("")}>
              {(letter, idx) => (
                <Motion.div
                  class={`${index.main__title} inline-block`}
                  initial={{ opacity: 0, scale: 0, x: -200 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + idx * 0.1, easing: "ease" }}
                >
                  {letter()}
                </Motion.div>
              )}
            </Index>
          </h1>
          <p class={`${index.main__description} font-bold text-3xl w-fit mx-auto`}>
            Ultimate song party guessing game
            {/* <Index each={"Ultimate song party guessing game".split("")}>
              {(letter, index) => {
                return (
                  <Motion.span
                    initial={{ opacity: "0.5" }}
                    animate={{ opacity: "1" }}
                    transition={{
                      duration: 2,
                      delay: index * 0.2,
                      repeat: Infinity,
                      direction: "alternate",
                    }}
                  >
                    {letter()}
                  </Motion.span>
                );
              }}
            </Index> */}
          </p>
        </div>
        <div
          class={`${index.host__join} relative mx-auto text-foreground text-2xl font-semibold w-[32rem] h-24 flex bg-background-accent rounded-xl`}
        >
          <button type="button" class="grow-[1] hover:grow-[2] duration-150 relative">
            Host
          </button>
          <div
            class={`${index.host__join__separator} w-1 bg-primary rounded-md h-[120%] translate-y-[-10%]`}
          ></div>
          <button type="button" class="grow-[1] hover:grow-[2] duration-150 relative">
            Join
          </button>
        </div>
      </div>
      <div class="pb-[200rem]"></div>
    </main>
  );
}
