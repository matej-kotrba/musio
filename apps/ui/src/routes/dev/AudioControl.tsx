import styles from "./AudioControl.module.css";
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
import { Motion } from "solid-motionone";
import type { DOMElement } from "solid-js/jsx-runtime";
import usePrevious from "~/hooks/usePrevious";
import { isServer } from "solid-js/web";

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  volume?: number;
  muted?: boolean;
  audioUrl?: string;
};

const AudioControl: Component<Props> = (props) => {
  const [local, rest] = splitProps(props, ["volume", "muted", "class"]);

  const [audio, setAudio] = createSignal<HTMLAudioElement>(
    new Audio(props.audioUrl)
  );
  const [isPlaying, setIsPlaying] = createSignal<boolean>(!audio()?.paused);
  const [volume, setVolume] = createSignal<number>(props.volume || 0.5);
  const prevVolume = usePrevious(volume);

  function handlePlayPauseButton() {
    if (!audio()) return;

    isPlaying() ? audio()!.pause() : audio()!.play();

    setIsPlaying((old) => !old);
  }

  function handleVolumeButtonClick() {
    if (volume() > 0) {
      setVolume(0);
    } else {
      setVolume(prevVolume());
    }
  }

  function handleTrackChange(
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    audio().currentTime = +e.target.value;
    if (isPlaying()) audio().play();
  }

  return (
    <div
      {...rest}
      class={cn(
        "w-full bg-background-accent h-8 rounded-md shadow-md flex items-center px-1 gap-2",
        local.class
      )}
    >
      <button type="button" on:click={handlePlayPauseButton}>
        <Show
          when={isPlaying()}
          fallback={<MotionIcon icon={"mingcute:play-fill"} />}
        >
          <MotionIcon icon={"material-symbols:pause-rounded"} />
        </Show>
      </button>
      <input
        type="range"
        class={`${styles.track} w-36 mr-auto`}
        min={0}
        max={30}
        value={audio().currentTime}
        on:input={handleTrackChange}
        style={`--percentage: ${audio()!.currentTime}%;`}
      />
      <button type="button" on:click={handleVolumeButtonClick}>
        <Show
          when={volume() > 0}
          fallback={<MotionIcon icon={"mynaui:volume-x-solid"} />}
        >
          <MotionIcon icon={"icon-park-solid:volume-notice"} />
        </Show>
      </button>
      <input
        type="range"
        class={`${styles.volume} w-24 bg-transparent`}
        value={volume()}
        on:change={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
};

const MotionIcon: Component<{ icon: string }> = (props) => {
  return (
    <Motion
      transition={{ duration: 0.2 }}
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
