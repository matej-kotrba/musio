import { Icon } from "@iconify-icon/solid";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section class="py-20 relative z-[1]">
      <div class="flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 lg:pr-10">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Guess the Song, <br />
            <span class="text-primary">Rock the Party!</span>
          </h1>
          <p class="text-xl mb-8 text-gray-300">
            Musio turns your gatherings into unforgettable music trivia experiences. Challenge
            friends, discover new tunes, and create lasting memories.
          </p>
          <div class="flex gap-2">
            <Button class="text-lg px-8 py-6">Host a game</Button>
            <Button variant={"secondary"} class="text-lg px-8 py-6">
              Join
            </Button>
          </div>
        </div>
        <div class="lg:w-1/2 mt-10 lg:mt-0">
          <div class="bg-secondary rounded-lg shadow-2xl p-8">
            <div
              class="grid grid-cols-2 gap-6 text-xl"
              style={{ "grid-template-rows": "repeat(2, auto 1em 1fr)" }}
            >
              <div
                class="grid items-center justify-center bg-background-DEAFULT rounded-lg p-6 gap-0"
                style={{ "grid-template-rows": "subgrid", "grid-row": "span 3" }}
              >
                <Icon
                  icon="fluent:people-community-32-filled"
                  class="text-6xl text-primary size-16 mx-auto"
                />
                <h3 class="font-semibold text-center">Play with friends</h3>
                <p class="self-start text-base text-center text-foreground/80 text-balance">
                  Create or join a lobby
                </p>
              </div>
              <div
                class="grid items-center justify-center bg-background-DEAFULT rounded-lg p-6 gap-0"
                style={{ "grid-template-rows": "subgrid", "grid-row": "span 3" }}
              >
                <Icon icon="majesticons:music" class="text-6xl text-primary size-16 mx-auto" />
                <h3 class="font-semibold text-center">Pick a song</h3>
                <p class="self-start text-base text-center text-foreground/80 text-balance">
                  Chosen songs will then be guessed
                </p>
              </div>
              <div
                class="grid items-center justify-center bg-background-DEAFULT rounded-lg p-6 gap-0"
                style={{ "grid-template-rows": "subgrid", "grid-row": "span 3" }}
              >
                <Icon icon="octicon:goal-16" class="text-6xl text-primary size-16 mx-auto" />
                <h3 class="font-semibold text-center">Guess others songs</h3>
                <p class="self-start text-base text-center text-foreground/80 text-balance">
                  Earn points based on speed
                </p>
              </div>
              <div
                class="grid items-center justify-center bg-background-DEAFULT rounded-lg p-6 gap-0"
                style={{ "grid-template-rows": "subgrid", "grid-row": "span 3" }}
              >
                <Icon icon="ic:round-leaderboard" class="text-6xl text-primary size-16 mx-auto" />
                <h3 class="font-semibold text-center">Be the best "Musier"</h3>
                <p class="self-start text-base text-center text-foreground/80 text-balance">
                  Be the first to reach the victory points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
