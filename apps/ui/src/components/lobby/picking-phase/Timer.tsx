import styles from "./Timer.module.css";
import { createEffect, createSignal, onCleanup } from "solid-js";

type Props = {
  maxTime: number;
  currentTime: number;
};

export default function Timer(props: Props) {
  const [time, setTime] = createSignal<number>(props.currentTime);
  let counterStartTime: number | null = null;
  let af: number;

  const setTimeForFrame = (timeFromStart: number) => {
    if (counterStartTime === null) counterStartTime = timeFromStart;
    setTime(props.maxTime - (timeFromStart - counterStartTime) / 1000);

    if (time() > 0) {
      af = requestAnimationFrame(setTimeForFrame);
    } else {
      setTime(0);
    }
  };

  createEffect(() => {
    af = requestAnimationFrame(setTimeForFrame);

    onCleanup(() => {
      cancelAnimationFrame(af);
      counterStartTime = null;
    });
  });

  return (
    <div class={`border-transparent w-fit h-fit rounded-full relative`}>
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
  );
}
