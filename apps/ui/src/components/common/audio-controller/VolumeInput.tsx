import { createEffect, createSignal, Show } from "solid-js";
import MotionIcon from "./MotionIcon";
import styles from "./VolumeInput.module.css";
import { usePrevious } from "~/hooks";

type Props = {
  onVolumeInputChange: (value: number) => void;
  value?: number;
};

export default function VolumeInput(props: Props) {
  const [volume, setVolume] = createSignal<number>(props.value ?? 0);
  const prevVolume = usePrevious(volume);

  createEffect(() => {
    if (props.value) {
      setVolume(props.value);
    }
  });

  function handleVolumeButtonClick() {
    if (volume() > 0) {
      setVolume(0);
    } else {
      setVolume(prevVolume());
    }

    props.onVolumeInputChange(volume());
  }

  function onVolumeInput(
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    setVolume(Number(e.target.value));

    props.onVolumeInputChange(volume());
  }

  return (
    <span class="contents">
      <button type="button" on:click={handleVolumeButtonClick}>
        <Show when={Number(volume()) > 0} fallback={<MotionIcon icon={"mynaui:volume-x-solid"} />}>
          <MotionIcon icon={"icon-park-solid:volume-notice"} />
        </Show>
      </button>
      <input
        type="range"
        class={`${styles.volume} w-16 bg-transparent`}
        min={0}
        max={100}
        value={Number(volume())}
        on:input={onVolumeInput}
      />
    </span>
  );
}
