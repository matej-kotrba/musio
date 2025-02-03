import styles from "./HowToPlay.module.css";
import clsx from "clsx";
import { createSignal, createEffect, onCleanup, JSX } from "solid-js";

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
      class="isolate"
      style={{ "--x": `${getCoords().x}px`, "--y": `${getCoords().y}px` }}
    >
      <h2 class="text-foreground text-left text-transparent mb-2">
        <span class="text-6xl mr-2" style={{ "-webkit-text-stroke": "1px hsl(var(--foreground))" }}>
          01
        </span>
        <span class="text-4xl text-foreground">How to play</span>
      </h2>
      <div class={`grid grid-cols-4 gap-2`}>
        <HowToPlayStep stepIndex={1} title="Host or join">
          Pick one of vast pallette endearing animal avatars, choose your name and head into lobby
          via hosting it or joining existing one.
        </HowToPlayStep>
        <HowToPlayStep stepIndex={2} title="Picking phase">
          First part of the game is picking a song for others to guess, you are able to listen to
          your selection and change its name before submitting it.
        </HowToPlayStep>
        <HowToPlayStep stepIndex={3} title="Guessing phase">
          Next ahead is guessing phase, here selected songs are about to take turns for everyone
          (except the one who chose it) to guess, doing so will grant them points necessary to win,
          speed is the key here!
        </HowToPlayStep>
        <HowToPlayStep stepIndex={4} title="Leaderboards">
          After guessing phase you'll be able to see overall leaderboards, either some of the
          players hit the points goal and final leaderboards are shown or next round will take
          place.
        </HowToPlayStep>
        <HowToPlayStep stepIndex={5} title="Repeat">
          If no-one hit the points goal, next round starts, repeating all the previous steps until
          on of the animals becomes the ULTIMATE MUSIER!
        </HowToPlayStep>
      </div>
    </section>
  );
}

type HowToPlayStepProps = {
  stepIndex: number;
  title: string;
  children: JSX.Element;
  class?: string;
};

function HowToPlayStep(props: HowToPlayStepProps) {
  return (
    <div
      class={clsx(
        `${styles["how-to-play__container"]} relative rounded-sm w-full p-4 text-foreground aspect-[3/2] bg-background-DEAFULT shadow-md`,
        props.class
      )}
    >
      <div>
        <div
          class={`relative font-bold text-xl mb-2 before:content-[''] before:w-3/4 before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
          before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent`}
        >
          {props.stepIndex}. {props.title}
        </div>
        <div class="text-balance">{props.children}</div>
      </div>
    </div>
  );
}
