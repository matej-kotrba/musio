import { Motion } from "solid-motionone";
import styles from "./SongQueueProgress.module.css";
import { createEffect, createSignal, For, Show } from "solid-js";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

type Props = {
  stepIndex: number;
  maxSteps: number;
  stepDescription?: string[];
};

export default function SongQueueProgress(props: Props) {
  const [lastHoveredIndex, setLastHoveredIndex] = createSignal<Maybe<number>>(undefined);
  let containerRef!: HTMLDivElement;

  // const getTooltipStartFlowRatio = (prevIndex: Maybe<number>, currentIndex: number): -1 | 0 | 1 => {
  //   if (prevIndex === undefined || prevIndex === currentIndex) return 0;
  //   return prevIndex < currentIndex ? -1 : 1;
  // };

  function changeLastHoveredIndex(newIndex: number) {
    setLastHoveredIndex(newIndex);
  }

  function getDistanceByIndexes(index1: Maybe<number>, index2: Maybe<number>, length: number) {
    if (index1 === undefined || index2 === undefined) return 0;
    const rect = containerRef.getBoundingClientRect();

    return ((index1 - index2) * rect.width) / length;
  }

  return (
    <div
      ref={containerRef}
      class={`${styles.progress} relative flex isolate w-full flex-nowrap justify-between`}
      style={{
        "--scale-ratio": `${props.stepIndex / (props.maxSteps - 1)}`,
      }}
    >
      <For each={Array.from(Array(props.maxSteps).keys())}>
        {(_, index) => {
          return (
            <Tooltip>
              <TooltipTrigger>
                <div
                  class={`size-8 rounded-full duration-300 delay-300 ${
                    index() <= props.stepIndex ? "bg-primary" : "bg-background-accent"
                  }`}
                  onmouseout={() => changeLastHoveredIndex(index())}
                ></div>
              </TooltipTrigger>
              <Show when={props.stepDescription?.[index()]}>
                {(description) => {
                  return (
                    <TooltipContent class="bg-transparent px-0 py-0 overflow-visible">
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
