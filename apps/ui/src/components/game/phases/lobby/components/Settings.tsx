import styles from "./Settings.module.css";
import { createEffect, createSignal, JSX } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { MIN_GAME_LIMIT_VALUE, DEFAULT_GAME_LIMIT_VALUE, MAX_GAME_LIMIT_VALUE } from "shared";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify-icon/solid";

type Props = {
  children: JSX.Element;
  gameLimit: number;
};

export default function LobbySettings(props: Props) {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [sliderValue, setSliderValue] = createSignal<number>(DEFAULT_GAME_LIMIT_VALUE);

  const getLeftOffsetPercentage = () =>
    ((sliderValue() - MIN_GAME_LIMIT_VALUE) / (MAX_GAME_LIMIT_VALUE - MIN_GAME_LIMIT_VALUE)) * 100;

  function onSaveButtonClick() {
    setIsOpen(false);
  }

  function handleOpenChange(isOpening: boolean) {
    if (isOpening === true) {
      setSliderValue(props.gameLimit);
    }
    setIsOpen(isOpening);
  }

  return (
    <Dialog open={isOpen()} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lobby settings</DialogTitle>
          <DialogDescription>
            <div class={`my-4`}>
              <label for="points-limit" class="mb-8 inline-block">
                You can change the original song name:
              </label>
              <div
                class={`${styles.slider__current_value} relative`}
                data-value={sliderValue()}
                style={{ "--left-offset-percentage": `${getLeftOffsetPercentage()}%` }}
              >
                <input
                  type="range"
                  name="points-limit"
                  class={`${styles.slider} w-full block bg-secondary rounded-full h-1 mt-4 shadow-sm`}
                  min={MIN_GAME_LIMIT_VALUE}
                  max={MAX_GAME_LIMIT_VALUE}
                  value={sliderValue()}
                  onInput={(e) => setSliderValue(parseInt(e.currentTarget.value))}
                />
              </div>
              <div class="flex justify-between text-foreground font-semibold">
                <span>{MIN_GAME_LIMIT_VALUE}</span>
                <span>{MAX_GAME_LIMIT_VALUE}</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant={"default"} on:click={onSaveButtonClick}>
                Save
              </Button>
            </DialogFooter>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      <DialogTrigger as="button">
        {props.children}
        {/* <Icon icon="ic:round-settings" class="text-2xl text-foreground duration-100" /> */}
      </DialogTrigger>
    </Dialog>
  );
}
