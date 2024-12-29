import { Icon } from "@iconify-icon/solid";
import {
  createSignal,
  Show,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { cn } from "~/libs/cn";
import { Presence, Motion } from "solid-motionone";

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  volume?: number;
  muted?: boolean;
};

const AudioControl: Component<Props> = (props) => {
  const [local, rest] = splitProps(props, ["volume", "muted", "class"]);

  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

  return (
    <div
      {...rest}
      class={cn(
        "w-full bg-background-accent h-8 rounded-md shadow-md flex items-center px-1 gap-2",
        local.class
      )}
    >
      <button type="button" on:click={() => setIsPlaying((old) => !old)}>
        <Show
          when={isPlaying()}
          fallback={<MotionIcon icon={"mingcute:play-fill"} />}
        >
          <MotionIcon icon={"material-symbols:pause-rounded"} />
        </Show>
      </button>
      <div class="w-24">
        <svg
          viewBox="0 0 200 50"
          xmlns="http://www.w3.org/2000/svg"
          class={`${styles}`}
        >
          <line
            x1={0}
            x2={200}
            y1={25}
            y2={25}
            stroke="hsl(var(--foreground))"
            stroke-width={2}
          ></line>
          <circle
            cx="100"
            cy="25"
            r="10"
            fill="white"
            class="group-hover:r-"
          ></circle>
        </svg>
      </div>
    </div>
  );
};

const MotionIcon: Component<{ icon: string }> = (props) => {
  return (
    <Motion
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      class="grid place-content-center"
    >
      <Icon icon={props.icon} class="text-2xl text-foreground duration-100" />
    </Motion>
  );
};

export default AudioControl;
