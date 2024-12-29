import { Icon } from "@iconify-icon/solid";
import {
  createEffect,
  createSignal,
  Show,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { cn } from "~/libs/cn";
import { Presence, Motion } from "solid-motionone";
import type { DOMElement } from "solid-js/jsx-runtime";

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  volume?: number;
  muted?: boolean;
};

type SolidEvent = MouseEvent & {
  currentTarget: HTMLDivElement;
  target: DOMElement;
};

const AudioControl: Component<Props> = (props) => {
  const [local, rest] = splitProps(props, ["volume", "muted", "class"]);

  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);
  const [volume, setVolume] = createSignal<number>(props.volume || 0.5);

  function handleVolumeChange(e: SolidEvent) {
    const rect = e.target.getBoundingClientRect();
    const x = e.x - rect.left;
    const ratio = x / rect.width;
    setVolume(ratio);
  }

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
      <div
        class="w-24 relative group py-2"
        onMouseDown={handleVolumeChange}
        onMouseMove={handleVolumeChange}
      >
        <div class="w-full h-[1px] bg-foreground/60 rounded-full"></div>
        <button
          type="button"
          class="bg-foreground size-2 rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2 duration-100 group-hover:size-3"
          style={{ left: `${volume() * 100}%` }}
        ></button>
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
      class="grid place-content-center size-4"
    >
      <Icon icon={props.icon} class="text-2xl text-foreground duration-100" />
    </Motion>
  );
};

export default AudioControl;
