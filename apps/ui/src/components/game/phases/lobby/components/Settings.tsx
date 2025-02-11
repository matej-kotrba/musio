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

export type OnSaveData = {
  gameLimit: number;
};

type Props = {
  children: JSX.Element;
  gameLimit: number;
  onSettingsSave?: (data: OnSaveData) => void;
};

export default function LobbySettings(props: Props) {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [gameLimitSliderValue, setGameLimitSliderValue] =
    createSignal<number>(DEFAULT_GAME_LIMIT_VALUE);

  const getLeftOffsetPercentage = () =>
    ((gameLimitSliderValue() - MIN_GAME_LIMIT_VALUE) /
      (MAX_GAME_LIMIT_VALUE - MIN_GAME_LIMIT_VALUE)) *
    100;

  function onSaveButtonClick() {
    setIsOpen(false);

    props.onSettingsSave?.({ gameLimit: gameLimitSliderValue() });
  }

  function handleOpenChange(isOpening: boolean) {
    if (isOpening === true) {
      setGameLimitSliderValue(props.gameLimit);
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
                data-value={gameLimitSliderValue()}
                style={{ "--left-offset-percentage": `${getLeftOffsetPercentage()}%` }}
              >
                <input
                  type="range"
                  name="points-limit"
                  class={`${styles.slider} w-full block bg-secondary rounded-full h-1 shadow-sm`}
                  min={MIN_GAME_LIMIT_VALUE}
                  max={MAX_GAME_LIMIT_VALUE}
                  value={gameLimitSliderValue()}
                  onInput={(e) => setGameLimitSliderValue(parseInt(e.currentTarget.value))}
                />
              </div>
              <div class="grid grid-cols-3 text-foreground font-semibold mt-1">
                <span class="text-left">{MIN_GAME_LIMIT_VALUE}</span>
                <span class="text-muted-foreground text-center">{gameLimitSliderValue()}</span>
                <span class="text-right">{MAX_GAME_LIMIT_VALUE}</span>
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
      <DialogTrigger as="button">{props.children}</DialogTrigger>
    </Dialog>
  );
}
