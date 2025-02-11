import { Icon } from "@iconify-icon/solid";
import { toPayloadToServer, createNewMessageToServer } from "shared";
import { createEffect, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { TooltipTrigger, TooltipContent, Tooltip } from "~/components/ui/tooltip";
import { useWsConnection } from "~/contexts/wsConnection";
import { useCopyToClipboard } from "~/hooks";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";
import LobbySettings from "./Settings";

export default function LobbyPhase() {
  const [gameStore, { queries }] = useGameStore();
  const { getLobbyHost } = queries;
  const ws = useWsConnection();

  const copyToClipboard = useCopyToClipboard();

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
    <section class="grid place-content-center relative">
      <LobbySettings gameLimit={gameStore.gameOptions.toPointsLimit}>
        <div class="absolute top-0 right-0">
          <Icon icon="ic:round-settings" class="text-2xl text-foreground duration-100" />
        </div>
      </LobbySettings>
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
          on:click={onNextRoundStartButtonClick}
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
