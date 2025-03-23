import { Icon } from "@iconify-icon/solid";
import {
  toPayloadToServer,
  createNewMessageToServer,
  gameLimitSchema,
  LobbyGameState,
  playerLimitSchema,
} from "shared";
import { createEffect, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { TooltipTrigger, TooltipContent, Tooltip } from "~/components/ui/tooltip";
import { useWsConnection } from "~/contexts/wsConnection";
import { useCopyToClipboard } from "~/hooks";
import { useGameStore } from "~/routes/lobby/stores/game-store";
import LobbySettings, { OnSaveData } from "./Settings";
import Loader from "~/components/common/loader/Loader";

export default function LobbyPhase() {
  const [gameStore, { queries }] = useGameStore();
  const { getPlayerByPublicId } = queries;
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

  const copyToClipboard = useCopyToClipboard();

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

  return (
    <section class="grid place-content-center relative">
      <Show when={getThisPlayer()?.isHost}>
        <LobbySettings
          gameLimit={gameStore.gameOptions.toPointsLimit}
          playerLimit={gameStore.gameOptions.playerLimit}
          onSettingsSave={handleLobbySettingsSave}
        >
          <div class="absolute top-0 right-0">
            <Icon icon="ic:round-settings" class="text-2xl text-foreground duration-100" />
          </div>
        </LobbySettings>
      </Show>
      <p class="text-foreground/70">
        Currently <span class="font-bold text-foreground">{gameStore.players.length}</span> players
        in lobby
      </p>
      <Show
        fallback={
          <span class="text-lg font-semibold">Waiting for the host to start next round</span>
        }
        when={getLobbyHost()?.publicId === gameStore.thisPlayerIds?.public}
      >
        <Button
          variant={"default"}
          class="mb-2"
          disabled={gameStore.players.length === 0}
          on:click={props.onNextRoundStartButtonClick}
        >
          Start next round
        </Button>
        <div class="flex gap-1 mb-4">
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
                on:click={() => copyToClipboard(window.location.href)}
              >
                <Icon icon="solar:copy-bold-duotone" class="text-2xl py-1 text-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy URL</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Show>

      <img src="/svgs/waiting.svg" alt="" class="w-80 aspect-[2/3]" />
    </section>
  );
}
