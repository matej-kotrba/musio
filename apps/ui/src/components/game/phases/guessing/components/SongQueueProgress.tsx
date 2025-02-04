import { Motion } from "solid-motionone";
import styles from "./SongQueueProgress.module.css";
import { For } from "solid-js";

type Props = {
  stepIndex: number;
  maxSteps: number;
};

export default function SongQueueProgress(props: Props) {
  return (
    <div
      class={`${styles.progress} relative flex isolate w-fit gap-8 flex-nowrap`}
      style={{
        "--scale-ratio": `${props.stepIndex / props.maxSteps}`,
      }}
    >
      <For each={Array.from(Array(props.maxSteps).keys())}>
        {(_, index) => {
          return (
            <div
              class={`size-8 rounded-full duration-200 delay-500 ${
                index() <= props.stepIndex ? "bg-primary" : "bg-background-accent"
              }`}
            ></div>
          );
        }}
      </For>
    </div>
  );
}
