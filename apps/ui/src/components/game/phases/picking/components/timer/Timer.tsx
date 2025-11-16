import styles from "./Timer.module.css";
import { createEffect, createSignal, onCleanup } from "solid-js";

type Props = {
  maxTime: number;
  currentTime: number;
  onTimeChange?: (current: number) => void;
};

export default function Timer(props: Props) {
  const [time, setTime] = createSignal<number>(props.currentTime);
  let counterStartTime: number | null = null;
  let af: number;

  const setTimeForFrame = (timeFromStart: number) => {
    if (counterStartTime === null) counterStartTime = timeFromStart;
    setTime(props.maxTime - (timeFromStart - counterStartTime) / 1000);
    props.onTimeChange?.(time());

    if (time() > 0) {
      af = requestAnimationFrame(setTimeForFrame);
    } else {
      setTime(0);
    }
  };

  createEffect(() => {
    props.currentTime;

    af = requestAnimationFrame(setTimeForFrame);

    onCleanup(() => {
      cancelAnimationFrame(af);
      counterStartTime = null;
    });
  });

  createEffect(() => {
    setTime(props.currentTime);
  });

  return (
    <>
      <div class="block md:hidden mx-2 h-2 w-full max-w-80 relative rounded-sm overflow-hidden">
        <div class="w-full h-full bg-background-accent"></div>
        <div
          class="bg-primary absolute inset-0"
          style={{ width: `calc(${time() / props.maxTime} * 100%` }}
        ></div>
      </div>
      <div class={`hidden md:block border-transparent w-fit h-fit rounded-full relative`}>
        <div
          class={`${styles.bg} absolute w-full h-full rounded-full`}
          style={`--deg: ${1 - time() / props.maxTime}turn`}
        ></div>
        <div
          class={`aspect-square min-w-28 w-fit grid place-content-center rounded-full text-lg font-bold`}
        >
          {time().toFixed(0)}
        </div>
      </div>
    </>
  );
}
