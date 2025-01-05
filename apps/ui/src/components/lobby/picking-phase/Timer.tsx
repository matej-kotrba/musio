import styles from "./Timer.module.css";
import { createEffect, createSignal, onCleanup } from "solid-js";

type Props = {
  maxTime: number;
  currentTime: number;
};

export default function Timer(props: Props) {
  const [time, setTime] = createSignal<number>(props.currentTime);
  let af: number;

  const setTimeForFrame = (timeFromStart: number) => {
    console.log(timeFromStart);
    setTime(props.maxTime - timeFromStart / 1000);

    if (time() > 0) {
      af = requestAnimationFrame(setTimeForFrame);
    }
  };

  createEffect(() => {
    af = requestAnimationFrame(setTimeForFrame);

    onCleanup(() => {
      cancelAnimationFrame(af);
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
        asd
      </div>
    </div>
  );
}
