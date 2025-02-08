import { Icon } from "@iconify-icon/solid";
import styles from "./HowToPlay.module.css";
import clsx from "clsx";
import { createSignal, createEffect, onCleanup, JSX } from "solid-js";
import { Motion, motion } from "solid-motionone";

export default function HowToPlay() {
  const [getCoords, setCoords] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });
  let sectionRef!: HTMLElement;

  const handleMouseMove = (e: MouseEvent) => {
    if (!sectionRef) return;

    setCoords({ x: e.x, y: e.y });
  };

  createEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return (
    <section
      ref={sectionRef!}
      class="isolate py-24"
      style={{ "--x": `${getCoords().x}px`, "--y": `${getCoords().y}px` }}
    >
      {/* <h2 class="text-foreground text-left text-transparent mb-2">
        <span class="text-6xl mr-2" style={{ "-webkit-text-stroke": "1px hsl(var(--foreground))" }}>
          01
        </span>
        <span class="text-4xl text-foreground">How to play</span>
      </h2> */}
      <h2 class="text-foreground font-bold text-5xl text-center mb-4">
        How to play <span class="text-primary">Musio</span>?
      </h2>
      <div class={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12`}>
        <HowToPlayStep icon="fluent:people-20-filled" title="Host or join" animationDelay={0.5}>
          Pick one of vast pallette endearing animal avatars, choose your name and head into lobby
          via hosting it or joining existing one.
        </HowToPlayStep>
        <HowToPlayStep icon="majesticons:music" title="Picking phase" animationDelay={1}>
          First part of the game is picking a song for others to guess, you are able to listen to
          your selection and change its name before submitting it.
        </HowToPlayStep>
        <HowToPlayStep icon="octicon:goal-16" title="Guessing phase" animationDelay={1.5}>
          Next ahead is guessing phase, here selected songs are about to take turns for everyone
          (except the one who chose it) to guess, doing so will grant them points necessary to win,
          speed is the key aspect here!
        </HowToPlayStep>
        <HowToPlayStep icon="ic:round-leaderboard" title="Leaderboards" animationDelay={2}>
          After guessing phase you'll be able to see overall leaderboards, either some of the
          players hit the points goal and final leaderboards are shown or next round will take
          place.
        </HowToPlayStep>
        <HowToPlayStep icon="material-symbols:repeat-rounded" title="Repeat" animationDelay={2.5}>
          If no-one hit the points goal, next round starts, repeating all the previous steps until
          on of the animals becomes the ULTIMATE MUSIER!
        </HowToPlayStep>
        <HowToPlayStep icon="mynaui:confetti-solid" title="The goal" animationDelay={3}>
          Your main goal is to have fun, enjoy the game and have a great time with your friends!
        </HowToPlayStep>
      </div>
    </section>
  );
}

type HowToPlayStepProps = {
  title: string;
  icon: string;
  children: JSX.Element;
  animationDelay: number;
  class?: string;
};

function HowToPlayStep(props: HowToPlayStepProps) {
  return (
    <div
      class={clsx(
        `${styles["how-to-play__container"]} relative group bg-background-DEAFULT p-8 rounded-xl shadow-lg`,
        props.class
      )}
    >
      <Motion.div
        class={`${styles["how-to-play__container-revealing-effect"]} absolute inset-0 rounded-xl`}
        style={{ "animation-delay": `${props.animationDelay}s` }}
      ></Motion.div>
      <div class="mb-6 flex justify-center">
        <div class="p-3 bg-background-dark rounded-full transition-colors duration-300">
          <Icon
            icon={props.icon}
            class="size-10 text-4xl grid place-content-center group-hover:text-primary duration-300 transition-colors"
          />
        </div>
      </div>
      <h3 class="text-2xl font-semibold mb-4 text-center group-hover:text-primary transition-colors duration-300">
        {props.title}
      </h3>
      <p class="text-gray-300 text-center">{props.children}</p>
      {/* <div>
        <Icon icon={props.icon} class="text-4xl text-primary mb-2" />
        <div class={`relative font-bold text-xl mb-2`}>{props.title}</div>
        <div class="text-balance">{props.children}</div>
      </div> */}
    </div>
  );
}
