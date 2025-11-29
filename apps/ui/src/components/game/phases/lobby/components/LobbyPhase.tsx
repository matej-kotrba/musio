import { Icon } from "@iconify-icon/solid";
import {
  toPayloadToServer,
  createNewMessageToServer,
  gameLimitSchema,
  LobbyGameState,
  playerLimitSchema,
} from "shared";
import { Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { TooltipTrigger, TooltipContent, Tooltip } from "~/components/ui/tooltip";
import { useWsConnection } from "~/contexts/wsConnection";
import { useCopyToClipboard, useLocalStorage } from "~/hooks";
import { useGameStore } from "~/routes/lobby/stores/game-store";
import LobbySettings, { OnSaveData } from "./Settings";
import Loader from "~/components/common/loader/Loader";
import Stats from "./Stats";

export default function LobbyPhase() {
  const [gameStore] = useGameStore();
  const ws = useWsConnection();

  const onNextRoundStartButtonClick = () => {
    if (!gameStore.thisPlayerIds?.private) return;

    ws.send?.(
      toPayloadToServer(
        gameStore.thisPlayerIds.private,
        createNewMessageToServer(gameStore.lobbyId, "START_GAME", {})
      )
    );
  };

  return (
    <Show
      when={(gameStore.gameState as LobbyGameState).type === "INITIAL"}
      fallback={<LobbyInBetweenRounds onNextRoundStartButtonClick={onNextRoundStartButtonClick} />}
    >
      <LobbyInitial onNextRoundStartButtonClick={onNextRoundStartButtonClick} />
    </Show>
  );
}

type LobbyTypesProps = {
  onNextRoundStartButtonClick: () => void;
};

function LobbyInBetweenRounds(props: LobbyTypesProps) {
  const [gameStore, { queries }] = useGameStore();
  const { getLobbyHost } = queries;

  return (
    <section class="grid place-content-center relative">
      <div class="flex flex-col gap-2 items-center">
        <Loader />
        <span>Waiting for host to start next round</span>
        <Show when={getLobbyHost()?.publicId === gameStore.thisPlayerIds?.public}>
          <Button class="w-full" on:click={props.onNextRoundStartButtonClick}>
            Next round
          </Button>
        </Show>
      </div>
    </section>
  );
}

function LobbyInitial(props: LobbyTypesProps) {
  const [gameStore, { queries, actions }] = useGameStore();
  const { getLobbyHost, getThisPlayer } = queries;
  const { setGameStore } = actions;
  const ws = useWsConnection();

  function handleLobbySettingsSave(data: OnSaveData) {
    if (!gameStore.thisPlayerIds?.private || getLobbyHost()?.publicId !== getThisPlayer()?.publicId)
      return;
    if (
      gameLimitSchema.safeParse(data.gameLimit).success &&
      playerLimitSchema.safeParse(data.playerLimit).success
    ) {
      setGameStore("gameOptions", "toPointsLimit", data.gameLimit);
      setGameStore("gameOptions", "playerLimit", data.playerLimit);
      ws.send?.(
        toPayloadToServer(
          gameStore.thisPlayerIds.private,
          createNewMessageToServer(gameStore.lobbyId, "CHANGE_GAME_OPTIONS", {
            newGameLimit: data.gameLimit,
            newPlayerLimit: data.playerLimit,
          })
        )
      );
    }
  }

  function canStartRound() {
    return gameStore.players.length > 1;
  }

  return (
    <section class="h-full relative">
      <div class="flex justify-end items-center gap-1">
        <Stats />
        <Show when={getThisPlayer()?.isHost}>
          <LobbySettings
            gameLimit={gameStore.gameOptions.toPointsLimit}
            playerLimit={gameStore.gameOptions.playerLimit}
            onSettingsSave={handleLobbySettingsSave}
          >
            <Icon
              icon="ic:round-settings"
              class="grid place-content-center text-2xl text-foreground duration-100"
            />
          </LobbySettings>
        </Show>
      </div>
      <div class="h-full grid place-content-center relative w-80 mx-auto">
        <p class="text-foreground/70">
          Currently <span class="font-bold text-foreground">{gameStore.players.length}</span>{" "}
          players in lobby
        </p>
        <Show
          fallback={
            <span class="text-lg font-semibold">Waiting for the host to start next round</span>
          }
          when={getLobbyHost()?.publicId === gameStore.thisPlayerIds?.public}
        >
          <Button
            variant={"default"}
            disabled={!canStartRound()}
            on:click={props.onNextRoundStartButtonClick}
          >
            Start next round
          </Button>
          <div class="my-1"></div>
          <LobbyCopyToClipboardCode />
          <Show when={!canStartRound()}>
            <div class="my-1"></div>
            <AlertOfPlayersMissing />
          </Show>
        </Show>

        <div class="hidden md:block">
          <DecorativeWaitingIndicator />
        </div>
        <p class="mt-8 text-foreground-muted text-sm mx-auto w-fit">
          How about leaving a star on{" "}
          <a
            href="https://github.com/matej-kotrba/musio"
            target="_blank"
            referrerPolicy="no-referrer"
            class="text-primary underline"
          >
            GitHub
          </a>{" "}
          in the meantime 🦭
        </p>
      </div>
    </section>
  );
}

function LobbyCopyToClipboardCode() {
  const [gameStore] = useGameStore();

  const copyToClipboard = useCopyToClipboard();
  const [getServerUrlLocalStorage] = useLocalStorage("serverUrl");

  return (
    <div class="flex gap-1 h-fit">
      <TextFieldRoot class="w-full">
        <TextField
          type="text"
          name="lobbyId"
          autocomplete="off"
          readOnly
          value={gameStore.lobbyId}
          class="text-center uppercase font-bold tracking-wider"
        />
      </TextFieldRoot>
      <Tooltip>
        <TooltipTrigger>
          <Button
            type="button"
            variant={"outline"}
            on:click={() => {
              const url = new URL(window.location.href);
              url.search = `serverUrl=${getServerUrlLocalStorage()}`;
              copyToClipboard(url.href);
            }}
          >
            <Icon icon="solar:copy-bold-duotone" class="text-2xl py-1 text-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy URL</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function AlertOfPlayersMissing() {
  return (
    <div class="flex gap-1 items-center border border-yellow-400 rounded-lg p-1">
      <Icon icon={"mingcute:alert-fill"} class="text-xl text-yellow-400" />
      <p class="text-sm">One more player needed to start the game</p>
    </div>
  );
}

function DecorativeWaitingIndicator() {
  return (
    <div class="relative mt-8">
      <div class="relative w-40 h-40 mx-auto">
        <div class="w-full h-full bg-background-dark rounded-full shadow-xl border-4 border-background-highlight relative shadow-primary/10">
          {/* Simple record grooves */}
          <div class="absolute inset-6 border border-background-highlight rounded-full opacity-40"></div>
          <div class="absolute inset-10 border border-background-highlight rounded-full opacity-30"></div>
          <div class="absolute inset-14 border border-background-highlight rounded-full opacity-20"></div>

          {/* Center label with subtle glow */}
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <Icon icon={"majesticons:music"} class="text-lg text-black" />
          </div>
        </div>
      </div>
    </div>
  );
}
