import styles from "./AudioControl.module.css";
import { Icon } from "@iconify-icon/solid";
import {
  createEffect,
  createSignal,
  onCleanup,
  Show,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { cn } from "~/libs/cn";
import { Motion } from "solid-motionone";
import usePrevious from "~/hooks/usePrevious";

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
  const [volume, setVolume] = createSignal<number>(props.volume || 50);
  const prevVolume = usePrevious(volume);
  const [time, setTime] = createSignal<number>(0);
  const [maxTime, setMaxTime] = createSignal<number>(0);

  function handlePlayPauseButton() {
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

  const handleAnimFrame = () => {
    if (isPlaying()) requestAnimationFrame(handleAnimFrame);
    setTime(audio().currentTime);
  };

  const handleAudioSrcLoad = () => {
    if (audio().duration) {
      setMaxTime(+audio().duration.toFixed(0));
    }
  };

  createEffect((prevAudio: HTMLAudioElement | undefined) => {
    if (prevAudio) {
      prevAudio.pause();
    }
    const newAudio = new Audio(props.audioUrl);

    setAudio(newAudio);
    setTime(0);
    // setIsPlaying(true);

    return newAudio;
  });

  createEffect(() => {
    audio().addEventListener("play", handleAnimFrame);
    audio().addEventListener("timeupdate", handleAnimFrame);
    audio().addEventListener("canplaythrough", handleAudioSrcLoad);

    onCleanup(() => {
      audio().removeEventListener("play", handleAnimFrame);
      audio().removeEventListener("timeupdate", handleAnimFrame);
      audio().removeEventListener("canplaythrough", handleAudioSrcLoad);
    });
  });

  createEffect(() => {
    isPlaying() ? audio()!.play() : audio()!.pause();
  });

  createEffect(() => {
    audio().volume = volume() / 100;
  });

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
        class={`${styles.track} w-28`}
        min={0}
        max={maxTime()}
        value={time()}
        on:input={handleTrackChange}
        style={`--percentage: ${
          (time() / 30) * 100 + 3 - 3 * 2 * (time() / 30)
        }%;`}
      />
      <span class="text-xs mr-auto">
        {Math.floor(time() / 60)}:{time().toFixed(0).padStart(2, "0")}/0:30
      </span>
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
        class={`${styles.volume} w-16 bg-transparent`}
        min={0}
        max={100}
        value={volume()}
        on:input={(e) => setVolume(Number(e.target.value))}
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
