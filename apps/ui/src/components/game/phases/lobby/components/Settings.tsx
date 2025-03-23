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
import {
  MIN_GAME_LIMIT_VALUE,
  MAX_GAME_LIMIT_VALUE,
  MIN_PLAYER_LIMIT,
  MAX_PLAYER_LIMIT,
} from "shared";
import { Button } from "~/components/ui/button";
import Slider from "~/components/ui/slider/Slider";

export type OnSaveData = {
  gameLimit: number;
  playerLimit: number;
};

type Props = {
  children: JSX.Element;
  gameLimit: number;
  playerLimit: number;
  onSettingsSave?: (data: OnSaveData) => void;
};

export default function LobbySettings(props: Props) {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [gameLimitSliderValue, setGameLimitSliderValue] = createSignal<number>(props.gameLimit);
  const [playerLimitSliderValue, setPlayerLimitSliderValue] = createSignal<number>(
    props.playerLimit
  );

  createEffect(() => {
    setGameLimitSliderValue(props.gameLimit);
  });

  createEffect(() => {
    setPlayerLimitSliderValue(props.playerLimit);
  });

  function onSaveButtonClick() {
    setIsOpen(false);

    props.onSettingsSave?.({
      gameLimit: gameLimitSliderValue(),
      playerLimit: playerLimitSliderValue(),
    });
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
              <label
                for="points-limit"
                class="text-secondary-foreground flex justify-between items-end"
              >
                <span>Game points needed to win:</span>
                <span class="text-lg font-semibold">{gameLimitSliderValue()}</span>
              </label>
              <Slider
                name="points-limit"
                min={MIN_GAME_LIMIT_VALUE}
                max={MAX_GAME_LIMIT_VALUE}
                value={gameLimitSliderValue()}
                onInput={(e) => setGameLimitSliderValue(parseInt(e.currentTarget.value))}
              />
            </div>
            {/* <Separator class="border-foreground/40 border-2 rounded-full" /> */}
            <div class={`my-4`}>
              <label
                for="player-limit"
                class="text-secondary-foreground flex justify-between items-end"
              >
                <span>Number of players able to join lobby:</span>
                <span class="text-lg font-semibold">{playerLimitSliderValue()}</span>
              </label>
              <Slider
                name="player-limit"
                min={MIN_PLAYER_LIMIT}
                max={MAX_PLAYER_LIMIT}
                value={playerLimitSliderValue()}
                onInput={(e) => setPlayerLimitSliderValue(parseInt(e.currentTarget.value))}
              />
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
