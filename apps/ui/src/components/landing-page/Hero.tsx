import { Icon } from "@iconify-icon/solid";
import { Button } from "../ui/button";
import { Motion } from "solid-motionone";

export default function Hero() {
  return (
    <section class="py-20 relative z-[1]">
      <div class="flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 lg:pr-10">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Ultimate party<br />
            <span class="text-primary" style={{"text-shadow": "0 0 4px #00000050"}}>Music Trivia!</span>
          </h1>
          <p class="text-xl mb-8 text-foreground">
            Musio turns your gatherings into unforgettable music trivia experiences. Challenge
            friends, discover new tunes, and create lasting memories.
          </p>
          <div class="flex gap-2">
            <Button class="text-lg px-8 py-6" as="a" href="/lobby-creator">
              Host a game
            </Button>
            <Button variant={"secondary"} class="text-lg px-8 py-6" as="a" href="/lobby-creator">
              Join
            </Button>
          </div>
        </div>
        <div class="@container w-full lg:w-1/2 mt-10 lg:mt-0">
          <div class="rounded-lg shadow-2xl p-8 border-2 border-zinc-600 motion-preset-oscillate-sm motion-duration-[4s]" style={{"background-image": "radial-gradient(circle at top right, hsl(var(--foreground) / 0.1), hsl(var(--secondary) / 1))"}}>
            <div class="flex flex-col @md:grid grid-cols-2 gap-6 text-xl grid-rows-[repeat(2,auto_1em_1fr)]">
              <HeroTile
                title="Play with friends"
                description="Create or join a lobby"
                icon="fluent:people-community-32-filled"
                appearFrom={{ x: -1, y: -1 }}
              />
              <HeroTile
                title="Pick a song"
                description="Chosen songs will then be guessed"
                icon="majesticons:music"
                appearFrom={{ x: 1, y: -1 }}
              />
              <HeroTile
                title="Guess others songs"
                description="Earn points based on speed"
                icon="octicon:goal-16"
                appearFrom={{ x: -1, y: 1 }}
              />
              <HeroTile
                title='Be the best "Musier"'
                description="Be the first to reach the victory points"
                icon="ic:round-leaderboard"
                appearFrom={{ x: 1, y: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroTileProps = {
  title: string;
  description: string;
  icon: string;
  appearFrom: {
    x: -1 | 1;
    y: -1 | 1;
  };
};

function HeroTile(props: HeroTileProps) {
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 1, x: 50 * props.appearFrom.x, y: 50 * props.appearFrom.y }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.4,
        easing: "ease-out",
      }}
      class="grid items-center justify-center bg-background-DEAFULT rounded-lg p-6 gap-0"
      style={{ "grid-template-rows": "subgrid", "grid-row": "span 3" }}
    >
      <Icon icon={props.icon} class="text-6xl text-primary size-16 mx-auto" />
      <h3 class="font-semibold text-center">{props.title}</h3>
      <p class="self-start text-base text-center text-foreground/80 text-balance">
        {props.description}
      </p>
    </Motion.div>
  );
}
