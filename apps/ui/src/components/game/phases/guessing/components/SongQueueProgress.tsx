import { Motion } from "solid-motionone";
import styles from "./SongQueueProgress.module.css";
import { createEffect, createSignal, For, Show } from "solid-js";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

type Props = {
  stepIndex: number;
  animateFromIndex: number;
  maxSteps: number;
  stepDescription?: string[];
};

export default function SongQueueProgress(props: Props) {
  const [currentIndex, setCurrentIndex] = createSignal<number>(Math.max(props.animateFromIndex, 0));
  const [lastHoveredIndex, setLastHoveredIndex] = createSignal<Maybe<number>>(undefined);
  let containerRef!: HTMLDivElement;

  function changeLastHoveredIndex(newIndex: number) {
    setLastHoveredIndex(newIndex);
  }

  function getDistanceByIndexes(index1: Maybe<number>, index2: Maybe<number>, length: number) {
    if (index1 === undefined || index2 === undefined) return 0;
    const rect = containerRef.getBoundingClientRect();

    return ((index1 - index2) * rect.width) / length;
  }

  function shouldApplyRangeBarStyles() {
    return props.maxSteps > 1;
  }

  createEffect(() => {
    props.stepIndex;
    setTimeout(() => setCurrentIndex(props.stepIndex));
  });

  return (
    <div
      ref={containerRef}
      class={`${
        shouldApplyRangeBarStyles() ? `${styles.progress} justify-between` : "justify-center"
      } relative flex isolate w-full flex-nowrap`}
      style={{
        "--scale-ratio": `${currentIndex() / (props.maxSteps - 1)}`,
      }}
    >
      <For each={Array.from(Array(props.maxSteps).keys())}>
        {(_, index) => {
          return (
            <Tooltip>
              <TooltipTrigger>
                <div
                  class={`size-8 rounded-full duration-300 delay-1000 ${
                    index() <= currentIndex() ? "bg-primary" : "bg-background-accent"
                  }`}
                  onmouseout={() => changeLastHoveredIndex(index())}
                ></div>
              </TooltipTrigger>
              <Show when={props.stepDescription?.[index()]}>
                {(description) => {
                  return (
                    <TooltipContent class="bg-transparent px-0 py-0 overflow-visible data-[closed]:duration-75">
                      <Motion.div
                        class="w-full h-full bg-secondary px-3 py-1.5 rounded-md"
                        initial={{ x: getDistanceByIndexes(lastHoveredIndex(), index(), 4) }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p>{description()}</p>
                      </Motion.div>
                    </TooltipContent>
                  );
                }}
              </Show>
            </Tooltip>
          );
        }}
      </For>
    </div>
  );
}
